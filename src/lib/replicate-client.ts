const REPLICATE_API = 'https://api.replicate.com/v1';
const PROXY_URL = '/api/replicate';

export async function generateVideo(prompt: string, onProgress?: (percent: number) => void) {
  const response = await fetch(`${REPLICATE_API}/predictions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'kling-ai/kling-v1',
      input: {
        prompt,
        duration: 5,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to start video generation');
  }

  const prediction = await response.json();
  const predictionId = prediction.id;

  let attempts = 0;
  const maxAttempts = 120;

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const checkResponse = await fetch(`${REPLICATE_API}/predictions/${predictionId}`);
    const result = await checkResponse.json();

    if (onProgress) {
      const progress = Math.min(10 + (attempts / maxAttempts) * 85, 95);
      onProgress(progress);
    }

    if (result.status === 'succeeded') {
      if (onProgress) onProgress(100);
      return result.output;
    }

    if (result.status === 'failed' || result.status === 'canceled') {
      throw new Error(result.error || 'Video generation failed');
    }

    attempts++;
  }

  throw new Error('Video generation timeout');
}

export async function generateImage(prompt: string) {
  const response = await fetch(`${REPLICATE_API}/predictions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'black-forest-labs/flux-schnell',
      input: {
        prompt,
        num_outputs: 1,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to start image generation');
  }

  const prediction = await response.json();
  const predictionId = prediction.id;

  let attempts = 0;
  const maxAttempts = 60;

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const checkResponse = await fetch(`${REPLICATE_API}/predictions/${predictionId}`);
    const result = await checkResponse.json();

    if (result.status === 'succeeded') {
      return result.output[0];
    }

    if (result.status === 'failed' || result.status === 'canceled') {
      throw new Error(result.error || 'Image generation failed');
    }

    attempts++;
  }

  throw new Error('Image generation timeout');
}
