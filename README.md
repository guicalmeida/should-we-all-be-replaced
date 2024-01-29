# Should We All Be Replaced?

An art installation about the need to know everything

## About the project

"Should We All Be Replaced?" is an art installation created by Guilherme Almeida and Rodrigo Maceira for the opening expo of Grande Avenida, an art school in downtown São Paulo. Its starting point was the Poem of Necessity, written by Brazilian poet Carlos Drummond de Andrade in 1940, which describes our endless need for something more until the world ends.

The theme is very much alive and relatable: we need to know about the latest reality shows, politics, sports, trends, news, movies. Google Trends is able to capture this agony perfectly: every hour there is a new subject everyone must learn as soon as possible, or risk missing out.

"Should We All Be Replaced?" turns trends into poetry: intertwining Drummond’s original verses with new, programmatically generated verses from Google’s latest trends in real-time, outputting a whole new poem in both text and AI-generated audio.

## Running the project

This project was developed on Linux using Node.js v21.5.0. Other setups might work, but I can’t guarantee. Also, if you intend to generate the audio poems, you must have FFmpeg installed and to play the audio generation loop, VLC Player.

As soon as you clone the project, run `npm install` to install the necessary dependencies.

## First Steps

There are two possible outputs for this project: the generated poem as text or as MP3.

To generate the text, simply run the command `npm run generateTextPoem` and 10 poems will be created in the directory `./textPoems`, as well as a metadata.json file informing the trends used.

To generate the audio, you must first inform your Elevenlabs’ API key in your .env file, as per the .env.example available. Also, be aware that it will take a lot of characters to generate a full audio poem, so keep an eye on your subscription.

## Available scripts

- `npm run init`: generates the audio files for each of the 13 original poem verses, made-up verses from 20 Google Trends, and 5 variations of the final stanza;
- `npm run generateDefaultLines`: creates individual audio files for the 13 original verses;
- `npm run generateGoogleLines`: creates individual audio files for the 20 current Google trends;
- `npm run generateFinalStanza`: creates five audio files with different voices reciting the final stanza. This can be decreased (or increased!) in the file `entrypoint.mjs`. The reason behind the different versions is for the audio loop to be more exciting when the art installation is on show;
- `npm run generateAudioPoem`: stitches the audio files for the original verses, the Google verses, the final stanza, and the city soundscape to create a final poem recital;
- `npm run startPoemLoop`: between 8 am and 11:59 pm, the script will continuously search for new trends, generate a new poem if there are new trends and play it using VLC directly on the terminal;
- `npm run generateTextPoem`: generates ten versions of the final poem in txt files. This can also be decreased, and the reason behind it is that alongside the voice recital, there are 10 LED scrolling signs running the poem.

## Special thanks

This project would absolutely not be possible without Rodrigo Maceira, founder of Grande Avenida and co-creator of this art project. It was while browsing through his personal library that he came up with this idea.
