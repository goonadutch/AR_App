# AR Mesh Viewer

Snap a photo, pick a category, get back a 3D model, view it in AR on iPhone.

## How it works

1. User selects a category from a fixed list of 8 (used for display only right now, not sent anywhere).
2. User takes or uploads a photo.
3. The photo is sent to a Hugging Face Space running SPAR3D for mesh generation.
4. The Space returns a `.usdz` file.
5. The page shows an AR Quick Look link. Tapping it opens iOS's built-in AR viewer, no app needed.

## Status

Frontend only right now. The inference call in `script.js` is a stub
(`runInference`) until the Hugging Face Space backend is ready.
