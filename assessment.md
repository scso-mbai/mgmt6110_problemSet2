# REFLECTION.md - TCG Singles Exchange
**Student:** Sean Eric So · **Course:** MGMT 6110 · **Problem Set 1**
**User sentence:** A trading card buyer opens this screen to purchase cards online, and knows it worked when they see a list of cards available for purchase in Singapore.
**Live link:** https://mgmt6110problemset2.vercel.app/

---

## Where did the agent make you faster, and by how much?
As someone who has a bachelor’s in computer science and experience with hardcoding, the agent made things significantly faster by doing all of the backend coding itself.
This gave me the time to read up on the APIs that were used for the problem set and get more practice on how to properly prompt the LLM. As a software engineer, this enabled
me to make more use of my creative and innovative skills, by simply coming up with new features or solutions to any issues the app had in the first place, all whilst delegating
the process of coding and debugging to the agent. Overall, the agent has effectively reduced multiple hours of software engineering to just a few minutes.

---

## Where did it cost you time, and whose fault was that?
The part of this problem set that costed me the most time was integrating the API into the backend system. As someone who isn’t as familiar with how APIs work, much less
figuring out a script that acquires data from it before displaying it on screen, it wasn’t an easy task giving these instructions to the agent. In fact, it felt like I was
a head chef in the kitchen where the agent is the one that can cook and I cannot. As a result, my results were a bit vague which resulted in the agent hallucinating a bit by
thinking what instruction it should implement instead. This resulted in a backend system that didn’t have my desired effect or wasn’t working properly. Thus, it is important
that when giving a prompt that I understand what it is that I am asking the agent to do, as to not generate a result that is beyond what I originally intended.

---

## Did it ever hand you something that looked right and was not?
When I first added the Geolocation API to the app, I was informed that the browser would likely prompt the user to enable access to their location. I was also informed that the
app as displayed on Google AI Studio might not work regardless of enabling the location privileges due to it being a preview pane that doesn’t use location services. This meant
that my app featured on Google AI Studio’s preview plane wouldn’t display the user’s current base. However, though the data being unreachable was unexpected, the preview app was
displaying “refused” “instead of the expected “unavailable”. This made me think that something in the backend was not working properly. As such, I talked about with an AI agent
and it subsequently explained that not all permission layers on the browser were being granted, and so the agent gave me a prompt for Google AI Studio that then enabled it to
access the location correctly. This is why it is important to have multiple failed case results that are reflected in the frontend in order to properly determine what issues are
occurring in the backend and how to potentially fix them.

---

## What did you have to know in order to supervise it?
In order to address the issue that was brought up in the previous answer, I had to be aware of the backend behaviour of the app. This meant understanding what UI elements would
be present under certain conditions. Though these behaviours were originally designed by the AI agent, I also gave some input on what text should be displayed whenever the user’s
location is unable to be accessed. As a result, when I saw that the incorrect UI element was being displayed for a specific condition, I knew that something in the backend
behaviour was wrong. Therefore, I prompted the agent to look into it and asked for it to be fixed.

---

## Which decisions did you keep, and should you have kept more or fewer?
For the decision making, I mainly asked the agent to use the API I provided it with to determine which area within Singapore they were, and that it would display this information
at the top of the UI. I wanted this data to be accurate to the user’s current position, so I asked it to cache every 5 seconds to a minute. This was to ensure that location data
was up to date. However, looking back on this feature, I figured it wasn’t as necessary to constantly have this information be accurate as this app isn’t a navigational tool and
it is unlikely that the user will use it whilst moving around. Additionally, I began to think that displaying the user’s current base was a redundant UI element as the user
should theoretically know what area they are in and are just looking for what stores are the closest to them. They can then use their navigational software to determine how to
get there. As such, I believe too much effort was put into this location tracker and that I fell for the bait that is attempting to make the app do more than what is 
undamentally needed to provide its user with the desired service.

---

## Now scale it up: what does this mean for a team of thirty?
I think because we are giving all of the manual work to the AI agents, we are effectively not paying attention to what happens to the backend of a software and how it works. As
someone with coding experience whilst working as a team, it can be incredibly frustrating when a specific function you’ve been working on was overwritten or changed due to another
teammate’s contribution and them not being aware about it. Thus, for this type of scenario, I would suggest that review points occur as each individual makes a push, so that they
are familiar with what their teammates added to project and how they’re supposed to work. This can help make more well-informed prompts that do not affect each other’s work in a
negative way. This process would require great diligence and communication between teammates, as it can be incredibly difficult to fix something when you don’t know what the
cause is.
