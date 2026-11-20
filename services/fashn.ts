const API_KEY = process.env.EXPO_PUBLIC_FASHN_API_KEY ?? '';
const BASE_URL = 'https://api.fashn.ai/v1';

const CATEGORY_MAP: Record<string, string> = {
  Tops: 'tops',
  Bottoms: 'bottoms',
  Dresses: 'one-pieces',
  Outerwear: 'tops',
};

async function uriToBase64DataUrl(uri: string): Promise<string> {
  const res = await fetch(uri);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function runTryOn(
  modelImageUri: string,
  garmentInput: string,
  category: string
): Promise<string> {
  const modelImage = await uriToBase64DataUrl(modelImageUri);
  const garmentImage = garmentInput.startsWith('http')
    ? garmentInput
    : await uriToBase64DataUrl(garmentInput);

  const runRes = await fetch(`${BASE_URL}/run`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_name: 'tryon-v1.6',
      inputs: {
        model_image: modelImage,
        garment_image: garmentImage,
        category: CATEGORY_MAP[category] ?? 'auto',
        mode: 'balanced',
      },
    }),
  });

  if (!runRes.ok) {
    const err = await runRes.text();
    throw new Error(`Fashn API error ${runRes.status}: ${err}`);
  }

  const { id } = await runRes.json();

  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const statusRes = await fetch(`${BASE_URL}/status/${id}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await statusRes.json();
    if (data.status === 'completed') return data.output[0] as string;
    if (data.status === 'failed') throw new Error(data.error || 'Generation failed');
  }

  throw new Error('Timed out waiting for try-on result');
}
