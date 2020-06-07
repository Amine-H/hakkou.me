---
title: React Native Good Practices - Architecture
date: "2017-11-17T22:40:32.169Z"
template: "post"
draft: false
slug: "react-native-good-practices-part-1"
category: "Frontend"
tags: ['javascript']
description: "We'll talk about how we can organize our react-native code."
socialImage: "/media/image-3.jpg"
---

and gets worse as the code gets bigger,
thankfully webpack allows us to turn our code from a mess into a mess in modules.

We'll be going throught how we can make better use of webpack & babel,
that way we could hopefully turn that mess into a more organized mess.

### Components

![Dog Building Tower](https://media.giphy.com/media/Q6p2n7oHvEjok/giphy.gif)

Components are the building blocks when it comes to React,
and making sure writing good Components is a must.

usually we'd like to create a folder for each component,
with the exception of 'small' components that we could just write in a single file.
We're also going to split each component into three parts:

#### index.js

This is pretty much the 'entry point' of your component,
this file is the only file that we would allow other components to access,
unless you added Redux to the blender, then you'd like to expose the action and probably the action creators too.

```javascript
import React, { Component } from 'react';
import Template from './template';

export default class MyComponent extends Component {
    ...
    render() {
        return <Template ...this.props />
    }
}
```

#### component.template.js

This file should handle nothing but how the component would be displayed,
as the name suggests, it's just dumb function takes in some props and renders the Component.

```javascript
import React from 'react';// do not foget this!
import {
    Text
} from 'react-native';
import style from './style';

export default (props) => {
    return (
        <Text style={ style.hello }>Hello World!</Text>
    );
}
```

#### component.style.js

style file is basically a dumb object that returns how each part of your component is styled,
this would allow us to avoid having ugly objects in our template.

```javascript
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    hello: {
        color: '#30A9DE',
        textAlign: 'center',
    },
})
```

in the next article we'll talk about how we can make our code even more cleaner.

