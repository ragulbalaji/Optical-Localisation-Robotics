# Optical-Localisation-Robotics

![Processed image](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/000/592/257/datas/gallery.jpg)

*<p style="text-align: center">Processed image</p>*

![Tracking the bot](https://scontent-arn2-1.xx.fbcdn.net/v/t34.0-0/p280x280/27294132_10215128890917897_2110733213_n.jpg?_nc_ad=z-m&_nc_cid=0&oh=fccbf223dc3e31c3d916321f3d624679&oe=5A6F6795)

*<p style="text-align: center">Tracking the bot</p>*

## Inspiration

Tracking bots and other objects in a play field is complex and expensive, largely due to the wide array of sensors required on each bot, such as ultrasound and LIDAR sensors.

Each bot also runs its own set of calculations for movement, possibly resulting in collisions and conflicts between individual bots.

On the other hand, a central server can track the entire play field via a camera and several AR markers, as well as control the movement of each individual bot, reducing cost, complexity and possibility for conflict.

## What it does

Instead of having bots in a play field to act autonomously, a central server with a god view of the play field controls them by dispatching commands to each of the bots. This greatly reduces the cost and complexity of the set up, as each bot no longer needs to be fitted with a wide array of expensive sensors, and the server only requires a camera.

The god view is attained by having unique AR markers indicating landmarks in the play field, such as the corners of the play field, the bots, and objects for the bots to interact with. By normalizing the images detected due to the markers and doing some math, the server can calculate exact movements required by the bots, and dispatch them to the bots.

## How we built it

* A website that tracks and detects objects on the play field, and calculates the geometry of the objects
* A Node.js server that gathers the data calculated by the website, calculates the movement needed of the bots, and dispatches commands to the bots
* An EV3 bot with Debian installed, running a Python socket server that listens for movement commands

## Challenges we ran into

* The varying lighting conditions throughout the day affected our image processing.
* The relatively lackluster performance of the EV3 forced us to find workarounds for performance limitations.
* Some libraries used were made several years ago and were outdated, requiring us to update several methodologies in the libraries.

## Accomplishments that we're proud of

* Achieving the core of our initial goal

## What we learned

## What's next for us?

## Built with

* JavaScript with ArUco and OpenCV for video capture and marker detection
* Python for hosting the EV3 server and handling locomotion
* Node.js for hosting the middleman server between the browser and the bot
