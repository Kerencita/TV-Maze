/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */
function responseArray (response){
  let showArray = response.map( show => {
    return {
      id: show.show.id,
      name: show.show.name,
      summary: show.show.summary ? show.show.summary: '',
      image: show.show.image? show.show.image.medium: 'https://tinyurl.com/tv-missing'
    }
  })

  return showArray;
}


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */


async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const response = await axios.get('https://api.tvmaze.com/search/shows?q=girls', {params: {q: query}})

  return responseArray(response.data);

}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card mb-4">
           <div class="card-body" data-show-id="${show.id}">
             <img class="car-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-secondary" id="episode-btn"> Episodes </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  const response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));

  return episodes;

}

function populateEpisodes(episodes){
  const $episodeList = $('#episodes-list');
  $episodeList.empty()
  for (let episode of episodes){
    let $listItem = $(`<li>${episode.name} (season: ${episode.season}, number: ${episode.number})</li>`);
    
    $episodeList.append($listItem);
  }

  $('#episodes-area').show();

}

$("#shows-list").on("click", "#episode-btn", async function handleEpisodes (evt){
  let showID = evt.target.parentElement.dataset.showId;
  console.log(showID)
  let showEpisodes = await getEpisodes(showID);
  populateEpisodes(showEpisodes)
})