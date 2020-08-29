var animeData;
var romajiQuery = `
query ($anime: String) {
  Media(search: $anime, type: ANIME) {
    seasonYear
    episodes
    title {
      english
      romaji
    }
  }
}
`;


async function convert(){
  let romajiVar = document.getElementById('txtShowName').value;
  let englishName;
  englishName = await convertRomaji(romajiVar);


}

// Function to convert Romaji to enlish. For anime.
// Current issues: It returns a promise insted of the data
async function convertRomaji(romaji) {
    if (!romaji) {
        return "No string provided"
    }

    // varible to provide the graphql query
    AnimeVaribles = {
      anime: romaji
    }

    //getting data from anilist
    var url = 'https://graphql.anilist.co',
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
      },
        body: JSON.stringify({
          query: romajiQuery,
          variables: AnimeVaribles
      })
  };
 await fetch(url,options).then(handleResponse)
                    .then(handleData)
                    .then(handleError);

//return returnedData;
return animeData.data.Media.title.english;

}


// Functions for promise
function handleResponse(response) {
  return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
  });
}

function handleData(data) {
  animeData = data;
}

// should look into alerting if there is an actual error
function handleError(error) {
  console.log(error);
}