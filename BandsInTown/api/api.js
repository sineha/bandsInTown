// The main file where API is called
let API = {
    id: 'asdf',
    base: 'https://rest.bandsintown.com/artists/'
};

//to display the dates wrt months
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

//get artist's main profile features 
$(document).ready(function () {
    $('#artist-search-form').on('submit', (e) => {
        e.preventDefault();
        let $this = $(this);
        let artistName = $this.find('input[name=artist]').val();
        let $artistProfile = $('#artist-profile');
        let $eventCount = $('#upcoming-events-count');
        let $events = $('#events');

        //set as undefined
        if (!artistName) {
            return;
        }

        // prep
        $artistProfile.empty();
        $events.empty();
        $eventCount.empty();
        
        fetch(`${API.base}${artistName}?app_id=${API.id}`)
            .then(res => res.json())
            .then(res => {
                //html for displaying artist profiles
                let $artist = `
                    <div class="listingResults">
                        <img class="personImage" src="${res.thumb_url}">
                        <div class="personDetails">
                            <p class="name">${res.name}</p>
                            <p class="listingSocialLink"><a href="${res.facebook_page_url}" title="${res.name}'s Facebook page" target="_blank">${res.facebook_page_url}</a></p>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                `;

                //to view upcoming events
                $artistProfile.append($artist);

                if (res.upcoming_event_count != 0) { //display count of upcoming events
                    $eventCount.text(`${res.upcoming_event_count} upcoming events`);

                    fetch(`${API.base}${artistName}/events?app_id=${API.id}`)
                        .then(res => res.json())
                        .then(res => {
                            let events = '';
                            res.forEach(event => {
                                let eventDate = new Date(event.datetime);
                                //html snippet to view specific event details
                                let $event = `
                            
                                    <div class="col-md-4">
                                        <div class="eventListing-eve">
                                        <div class="row">
                                            <div class="col">
                                                <p class="country">Country</p>
                                                <p class="country-name">${event.venue.country}</p>
                                                <p class="venue">Venue</p>
                                                <p class="venue-loc">${event.venue.name}</p>
                                            </div>
                                            <div class="col">
                                                <p class="city">City</p>
                                                <p class="city-name">${event.venue.city}</p>
                                                <p class="date">Date</p>
                                                <p class="date-e">${eventDate.getDate()} ${monthNames[eventDate.getMonth()]}, ${eventDate.getFullYear()}</p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                `;

                                events += $event;
                            });

                            $events.append(events);
                        });
                        //in case no upcoming events display message
                } else {
                    $eventCount.text(`Sorry! There are no upcoming events by ${res.name}`);
                }
                $("#loader").css("display", "none");//loader 
            });

    });
});