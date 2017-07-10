## JavaScript API ##

### 1. Properties ###

This component can be customized using several properties which are described below. These properties must be passed to the component when it's instantiated.

*Example:*

```js
$( '#my-component' ).myComponent({
	width: 960,
	height: 500
});
```

#### width ####

>Sets the width

>*Default value:* 500

#### height ####

>Sets the height

>*Default value:* 300

#### responsive ####

>Makes the component responsive

>*Default value:* true



### 2. Public Methods ###

Available public methods:

#### gotoThing( index ) ####

>Scrolls to the thing at the specified index.

#### nextThing() ####

>Scrolls to the next thing.

#### previousThing() ####

>Scrolls to the previous thing.



## 3. Callbacks ##

Callbacks (or events) are used to detect when certain actions take place. The callbacks can be added when the component is instantiated, or at a later time.

*Examples:*

```js
$( '#my-component' ).myComponent({
width: 900,
height: 400,
gotoThing: function( event ) {
console.log( event.index );
},
componentResize: function() {
console.log( 'component is resized' );
}
});

$( '#my-component' ).on( 'gotoThing', function( event ) {
console.log( event.index );
})
```

As it can be noticed, the callback functions have an "event" parameter which contains some information about that event.

The list of available events:

#### init ####

>Triggered after the component was created.

#### update ####

>Triggered when the 'update' method is called, either automatically or manually.
