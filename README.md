# Kyra.tv proprietary intel mini application

![cover image](/kyra-grab.png);

1. After cloning the app, create an .env file. The .env.default file shows its four necessary properties.
    -The YOUTUBE_API_VERSION ('v3'), YOUTUBE_API_KEY, and PORT are most important.

2. See the constants files for strings and data objects that are used in the app.

3. You asked to see two things from this work: 
    (a) Development style and ability.
    (b) Vision and strategic capabilities.

    Toward this end, I expanded the app in the following ways:
        -Rather than managing one show, I included three — PAQ, NAYVA, and Bad Canteen. Why not?
        -I added a "Comps" view to demonstrate the ability to add episodes from across Shows for comparison.
            -I've found this kind of thing useful in my own experience, especially when data accompanies individual episodes.
            
4. Calls to YouTube are made through a small web server (Express) to protect the API key.

5. I used setInterval to check for new episodes on YouTube. It's set to run every minute.
    -I believe it works, but this was hard to test, and developing a way to mock new vidoes was too much to tackle.
    -In the future, I'd want to consider other options, including web sockets.
    -BE CAREFUL! My version of this feature is a data hog! It'll max out small Google's free API quotas fast...!!!

6. There are some rough edges here. The app can be a little slow, for instance, when rendering episodes. Food for thought.
    -In addition, while I would have liked to manage the views via the URL bar and React-Router, I didn't quite get there.
    -If you hit the back button, you'll leave the site.

7. I tried to document what I did as best as possible. I find it's the only way to keep on top of what I've done.

8. re: packages 
    -I used a prototyping library for Styled Components (v5). Any warning about peer dependencies (v4) are an error.
    -My date grouping package uses an out-of-date _lodash method. Something to consider another time.
    -Finally, you'll see that npm reports low-level securty issue. I did not track it down.

9. Happy to answer any questions.

All the best.
