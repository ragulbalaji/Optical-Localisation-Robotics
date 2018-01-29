# Optical-Localisation-Robotics

![Idea Map](/Assets/IdeaMap.png)

![Robot Things](/Assets/Giphy.gif)

### FIND ME ON DEVPOST: https://devpost.com/software/bw-optical-localisation-plus-robotics/

## Inspiration

Tracking bots and other objects in a play field is complex and expensive, largely due to the wide array of sensors required on each bot, such as ultrasound and LIDAR sensors.

Each bot also runs its own set of calculations for movement, possibly resulting in collisions and conflicts between individual bots.

On the other hand, a central server with GOD VIEW can track the entire play field via a camera and several AR markers, as well as control the movement of each individual bot, reducing cost, complexity and possibility for conflict.

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

* Intended Vision of getting a simple robot to execute tasks in the play area
* Achieving the core of our initial goal

## What we learned
Intense Perseverance in the face of mind boggling math to do computer vision and engineering a distributed system with no single point of failure.

## What's next for us?
To use multiple cameras placed at different locations around the playfield coupled with the use of Effective Point and Perspective Algorithm to compose a playfield. This allows the multiple cameras to track the robots and the elements on the playfield effectively.

## Built with

* JavaScript, Python, Shiz tonna Math, weird hacks, data tricks, and some love and lack thereof of sleep

![Processed image](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/000/592/257/datas/gallery.jpg)

![Tracking the bot](https://scontent-arn2-1.xx.fbcdn.net/v/t34.0-0/p280x280/27294132_10215128890917897_2110733213_n.jpg?_nc_ad=z-m&_nc_cid=0&oh=fccbf223dc3e31c3d916321f3d624679&oe=5A6F6795)
