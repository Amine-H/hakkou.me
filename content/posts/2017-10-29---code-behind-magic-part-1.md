---
title: Code Behind the Magic - $resource
date: "2017-10-29T22:40:32.169Z"
template: "post"
draft: false
slug: "code-behind-magic-part-1"
category: "Frontend"
tags: ['javascript']
description: "We'll look into AngularJS's $resource from a different angle."
socialImage: "/media/image-3.jpg"
---

This post is going to be the first in a series of blog posts called Code Behind the Magic,
where I'll present some libraries that either make you feel puzzled, grateful or both.

I've used AngularJS when it still was a thing, enjoyed the two-way databinding,
what I enjoyed more was how well the different components, services played together,
that aside, I'd like to talk about how handy AngularJS `$resource` was.

`$resource` is an AngularJS service that allowed me to create REST clients as easy as updating a Json Object,

```javascript
var User = $resource('/user/:userId', { userId:'@id' });
```

that little line will create a service with methods like, `query`, `get`, `save` and `remove`,
to cast that spell you can do something like this:

```javascript
var user = User.get({userId:123}, function() {
  user.abc = true;
  user.$save();
});
```

what makes it even better is that you could use it on your controller and do something like this,
and not worry about no promises.

```javascript
this.users = User.query();
```

You might say what's interesting about this, I'd say `User.query` is not synchronous,
although that syntax might suggest that it is.

What will happen when you call `User.query` is that it'll return immediately with an empty array,
and most importantly keeping a reference to that array, so that it'd populate it with the result when it's finally here.

Let's move to the interesting part, let's make a clone for `$resource`, just so that we could understand what's going on under the hood.
let me make this point clear, I am not going to make an exact copy of `$resource`, that's not the point.

```javascript
function $resource(url) {

    function _get(id) {
        var resource = {};//usually $resource would add basic functions to this Object such as $save, $remove
        var promise = $http({ method: 'GET', url: url.concat(id) });

        promise.then((response) => Object.assign(resource, { $promise: promise } , response));
        return resource;
    }

    function _query() {
        var resource = [];
        var promise = $http({ method: 'GET', url: url });

        promise.then((response) => Object.assign(resource, { $promise: promise } , response));//yeah, you can totally add functions to an Array in js
        return resource;
    }

    function _save(_resource) {
        var resource = Object.assign({}, _resource);
        var promise = resource.id? $http({ method: 'PUT', url: url.concat(id) }) : $http({ method: 'POST', url: url });

        promise.then((response) => Object.assign(resource, { $promise: promise } , response));
        return resource;
    }

    function _remove(id) {
        var resource = {};
        var promise = $http({ method: 'DELETE', url: url.concat(id) });

        promise.then((response) => Object.assign(resource, { $promise: promise } , response));
        return resource;
    }

    return {
        get: _get,
        query: _query,
        save: _save,
        remove: _remove,
    }
}

```

Using our custom `$resource` would be pretty much the same as AngularJS's, of course it has very little coverage of the actual thing

```javascript
var Book = $resource('/books/');

var book = Book.get(1);//fetch the book with the id=1
book.title = 'Clean Code';
book = Book.save(book);//update the book
book = Book.remove(book.id);//remove the book
```

I enjoyed writing this post, and already planning few follow up posts.
If you would like me to write something about a library,
framework that puzzled you just write it in the comment section and I'll make sure to check it out.
