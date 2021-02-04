/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


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
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  // console.log(response)
  const showsResponse = response.data;
  // console.log(shows)
  let showData = {};
  let shows = []
  for (let result of showsResponse){
    showData = {id:result.show.id,
      name: result.show.name,
      summary: result.show.summary,
      image: result.show.image ? result.show.image.medium : 'https://tinyurl.com/tv-missing'};
    shows.push(showData);
  }
  //clear input
  const queryInput  = document.getElementById('search-query');
  queryInput.value = '';
  return shows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    //  //make image
    // console.log(show)
    // let imgSource;
    // console.log(imgSource)
    // if(imgSource === null){
    //   imgSource = 'https://tinyurl.com/tv-missing'
    // } else {
    //   imgSource = show.image.medium;
    // };
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-info get-episodes" id="episode-btn">Episodes</button>
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

async function getEpisodes(showId) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const result = await axios.get(`http://api.tvmaze.com/shows/${showId}/episodes`);
  //console.log(result)
  const idShows = result.data;
  let episode = {};
  let episodes = [];
  for (let show of idShows){
    // console.log(show)
    episode = {id:show.id, name: show.name, season:show.season, number: show.number}
    episodes.push(episode);
  }
    // TODO: return array-of-episode-info, as described in docstring above
  return episodes;
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes) {
    let $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);

    $episodesList.append($item);
  }

  $("#episodes-area").show();
}

const showsList = document.querySelector('#shows-list')
const episodesBtn = document.querySelector('#episode-btn');

$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  console.log(evt)
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});






