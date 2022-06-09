import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';


const API_BASE_URL = 'https://pixabay.com/api/?';
const API_KEY = '27942412-dca5ba7a5685e348a08d8d646';

const StyledAppContainer = styled.div`
  height: 100vh;
  width: 100%;
  padding-top: 20px;
  background-color: #f2f2f2;

  input {
    padding: 8px 12px;
    margin-right: 4px;
  }
`;

const StyledSearchFieldContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledImageGalleryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 4px;
`;

const StyledImageGalleryColumn = styled.div`
  flex: 25%;
  padding: 0 4px;
`;

const StyledImage = styled.img`
  margin-top: 8px;
  vertical-align: middle;
`;

function mapApiResponseByColumn(data, column) {
  const result = [];
  for (let i = 0; i < column; i++) {
    let start = i;
    if (i !== 0) {
      start += 1;
    }
    result.push(data.slice(start, start + data.length /  column));
  }

  return result;
}

function SearchField({ value, onChange, onClick }) {
  return (
    <StyledSearchFieldContainer>
      <input type="text" value={value} onChange={onChange} />
      <button type="button" onClick={onClick}>Search</button>
    </StyledSearchFieldContainer>
  );
}

async function searchImages(query) {
  const options = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
  };
  const searchParams = new URLSearchParams(options);

  let data = [];
  try {
    const response = await axios.get(API_BASE_URL, {
      params: searchParams,
    });
    data = response.data;
  } catch (err) {
    console.error(err);
  }
  

  return data;
}

function ImageGalleryColumns({ images }) {
  return (
    <>
      {images.map((image, index) => (
        <StyledImageGalleryColumn key={index} >
          {image.map((img, idx) => (
            <StyledImage src={img} alt="Search Result" key={idx} style={{ width: '100%', }}/>
          ))}
        </StyledImageGalleryColumn>
      ))}
    </>
  );
}

function ImageGallery({images, columnCount}) {
  const mappedImages = mapApiResponseByColumn(images, columnCount);

  return (
    <StyledImageGalleryRow>
      <ImageGalleryColumns images={mappedImages} />
    </StyledImageGalleryRow>
  );
}

function App() {
  const [inputText, setInputText] = useState('');
  const [images, setImages] = useState([]);

  const handleInputTextChange = e => setInputText(e.target.value);
  const handleSearchSubmit = async () => {
    const data = await searchImages(inputText);
    const imagesUrl = data.hits.map(imageDetails => imageDetails.largeImageURL);
    setImages(imagesUrl);
  };

  return (
    <StyledAppContainer>
      <SearchField
        value={inputText}
        onChange={handleInputTextChange}
        onClick={handleSearchSubmit}
      />
      {images.length > 0 && (
        <ImageGallery images={images} columnCount={4} />
      )}
    </StyledAppContainer>
  )
}

export default App;