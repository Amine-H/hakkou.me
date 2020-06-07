---
title: Make a chatbot that speaks like you
date: "2019-12-04T22:40:32.169Z"
template: "post"
draft: false
slug: "make-a-chatbot-that-speaks-like-you"
category: "AI"
tags: ['javascript', 'python']
description: "We'll write a chatbot that'll learn from your texts!"
socialImage: "/media/image-3.jpg"
---

If you're a [Silicon Valley](https://www.imdb.com/title/tt2575988/) fan like me I am sure you've seen the episode where Gylfoyle made an chatbot and made it chat with Dinesh all day without the latter even realising it untill later that day.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Y1gFSENorEY?start=6" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Alright, let's make you a chatbot, but before we jump into this, we'll need:

- Data? well, you gotta feed your AI, it doesn't work for free
- Chatbot? we'll need a conversational dialog engine

## Data

To provide the bot with the data it needs we'll need some data, or in this case your texts.
The first idea that popped into my head is of course facebook, because `(1)` that's where I can find all the text I'll need, and `(2)` we can export the data in an easily exploitable format, in this case it's `JSON`.

**Make sure not to share your data or the trained model** with anyone as it might contain sensitive information, you could however fix that with a De-identifier such as Google Cloud's [`DLP`](https://cloud.google.com/dlp/docs/deidentify-sensitive-data).

### Export messages from facebook

To export your messages from facebook if you haven't already follow these steps:
- go to [`Settings`](https://web.facebook.com/settings)
- click on [`Your Facebook Information`](https://web.facebook.com/settings?tab=your_facebook_information)
- navigate to `Download Your Information`
- select `JSON` in the `Format` select box
- click on `Deselect All` and click `Messages` under the `Your Information` section
- click on `Create File`

This could take a while, all you gotta do right now is wait for an email that says that your data is ready for download.

### Preparing the data

You'll get your data in a `zip file` which contains an `inbox` folder, this folder would contain all the conversations you have with all of your contacts organized on folders each folder is prefixed by the username of the contact.

Each conversation folder contains atleast a `message_1.json` along with other folders such as `gifs`, that's of no interest to us in this case.

The `message_1.json` file has a very simple structure and it's as follows:

```javascript
{
  "participants": [
    {
      "name": "Simhi"
    },
    {
      "name": "Amine Hakkou"
    }
  ],
  "messages": [
    {
        "sender_name": "Simhi",
        "timestamp_ms": 1499810593070,
        "content": "Afeen!",
        "type": "Generic"
    }
  ],
  "title": "Simhi",
  "is_still_participant": true,
  "thread_type": "Regular",
  "thread_path": "inbox/Simhi_blahblah"
}
```

In this article I'll simplify it a little as we're not going to feed it all the data from all of the conversations,
We'll do it with one, however if you feel like feeding it all the data then you could tweak the code a little for that.

```javascript
function readConversation(path) {
    return JSON.parse(require('fs').readFileSync(
        path.concat('/message_1.json'),
        { encoding: 'utf8' },
    ))
}
```

We'll also need to clean the messages as it might contain non text payloads, such as `gifs`, `videos`..

```javascript
function filterMessagesWithContent(messages = []) {
    return messages.filter(message => message.content)
}
```

If you skimmed over your messages you'll notice that it's sorted from new to old, we'll need to fix that.

```javascript
function reverseMessagesOrder(messages = []) {
    return messages.reverse()
}
```

Also there is this little thing, where you or the other party of the conversation send multiple consecutive texts, for the sake of simplicity we could group them in one message.

```javascript
function groupConsecutiveMessages(messages = []) {
    const result = []
    let previousMessage = messages[0]

    for(let i = 1; i < messages.length; i++) {
        const message = messages[i]
        if(message.sender_name === previousMessage.sender_name) {
            previousMessage = { ...previousMessage, content: content.concat(" " + message.content) }
        } else {
            result.push(previousMessage)
            previousMessage = message
        }
    }
    // handle last element
    result.push(previousMessage)
    return result
}
```

We'll need to cleanup the `JSON`, we'll be losing information sure, we won't need the rest anyway.

```javascript
function messagesContent(messages = []) {
    return messages.map(m => m.content)
}
```

And finally write the result back to the fs.

```javascript
function writeMessages(path, messages) {
    require('fs').writeFileSync(
        path,
        JSON.stringify(messages),
    )
}
```

Putting it all together would look something like this:

```javascript
    const path = 'path-to-your-data/inbox/Simhi_blahblah'
    const conversation = readConversation(path)
    const messages = (
        messagesContent(
            groupConsecutiveMessages(
                reverseMessagesOrder(
                    filterMessagesWithContent(
                        conversation.messages
    )))))

     writeMessages(path.concat('/messages.json'), messages)
```

Now to turn this on we'll have to do something like:

```bash
node transform.js
```

## The Chatbot

Alright now that we got the data ready, we'll need to train our AI, you can find a lot of conversational engines around, such as [`chatterbot`](https://chatterbot.readthedocs.io/en/stable/) and [`rasa`](https://rasa.com/docs/getting-started/).

We'll go with `chatterbot` because it has a simpler and straightforward API.

### Prequisites

You'll need to have python3 installed on your machine.

### Install

```bash
pip3 install chatterbot chatterbot-corpus
```

### Code

the code below reads the json file we wrote using our transformer script, trains the model and answer's to the messages it receives from the `stdin`.

there's a lot you could improve on it, I kept it simple so I used chatterbot's `ListTrainer` with no additional configuration.

```python
import sys
import json
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer

with open('messages.json', 'r') as f:
    conversation = json.load(f)

chatbot = ChatBot('Amine')

trainer = ListTrainer(chatbot)

trainer.train(conversation)

while True:
    message = input('>')
    response = chatbot.get_response(message)
    print('You:', message)
    print('Amine:', response)

```

### Usage

Now all you gotta do is run the chatbot.

```bash
python3 chatbot.py
```

[![asciicast](https://asciinema.org/a/c9p0294J8AYK2v5SCmdRE69LC.svg)](https://asciinema.org/a/c9p0294J8AYK2v5SCmdRE69LC)
