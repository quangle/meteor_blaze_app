import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/task.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks', Meteor.userId());
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      return Tasks.find(
        {
          checked: {
            $ne: true
          }
        },
        {
          sort: {
            createdAt: -1
          }
        }
      );
    }
    return Tasks.find({}, {
      sort: {
        createdAt: -1
      }
    });
  },
  incompleteCount() {
    return Tasks.find(
      {
        checked: { $ne: true }
      }
    ).count();
  },
  currentUser() {
    return Meteor.user();
  }
});

Template.body.events({
  'submit .new-task' (event) {
    event.preventDefault();
    let text = event.target.text.value;
    if (text.length > 0) {
      Meteor.call('tasks.insert', text);
      event.target.text.value = '';
    }
    else {
      return
    }
  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});
