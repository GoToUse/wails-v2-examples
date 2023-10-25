import { useCallback, useEffect, useState } from "react";
import {
  GetRandomImageUrl,
  GetBreedList,
  GetImageUrlsByBreed,
} from "../wailsjs/go/main/App";

import "./App.css";

export default function App() {
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [breeds, setBreeds] = useState<string[] | null>(null);
  const [photos, setPhotos] = useState<string[] | null>(null);
  const [randomImageUrl, setRandomImageUrl] = useState<string>("");
  const [showRandomPhoto, setShowRandomPhoto] = useState<boolean>(false);
  const [showBreedPhotos, setShowBreedPhotos] = useState<boolean>(false);

  function init() {
    getBreedList();
  }

  function getBreedList() {
    GetBreedList().then((result: string[]) => setBreeds(result));
  }

  function getRandomImageUrl() {
    setShowRandomPhoto(false);
    setShowBreedPhotos(false);
    GetRandomImageUrl().then((result: string) => setRandomImageUrl(result));
    setShowRandomPhoto(true);
  }

  const getImageUrlsByBreed = useCallback(() => {
    init();
    setShowRandomPhoto(false);
    setShowBreedPhotos(false);
    GetImageUrlsByBreed(selectedBreed).then((result: string[]) => {
      setPhotos(result);
    });
    setShowBreedPhotos(true);
  }, [selectedBreed]);

  useEffect(() => {
    init();
  });

  function changeSelect(event: any) {
    setSelectedBreed((event.target as any).value as string);
  }

  return (
    <>
      <h3>Dog API</h3>
      <div>
        <button className="btn" onClick={getRandomImageUrl}>
          Fetch a dog randomly
        </button>
        Click on down arrow to select a breed
        <select onChange={changeSelect} value={selectedBreed}>
          {breeds &&
            breeds.map((breed: string, idx: number) => {
              return (
                <option key={idx} value={breed}>
                  {breed}
                </option>
              );
            })}
        </select>
        <button className="btn" onClick={getImageUrlsByBreed}>
          Fetch by this breed
        </button>
      </div>
      <br />
      {showRandomPhoto && (
        <>
          <img src={randomImageUrl} alt="No dog found." id="random-photo" />
        </>
      )}
      {showBreedPhotos &&
        photos &&
        photos.map((photo: string, id: number) => (
          <img
            src={photo}
            key={id}
            alt="No dog found."
            id={`breed-photos-${id}`}
          />
        ))}
    </>
  );
}
