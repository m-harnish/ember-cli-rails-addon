import Ember from 'ember';
import $ from 'jquery';

export default {
  name: 'ember-cli-rails-addon-csrf',

  initialize() {
    if($ && $.ajaxPrefilter) {
      $.ajaxPrefilter((options, originalOptions, xhr) => {
        const token = $('meta[name="csrf-token"]').attr('content');
        xhr.setRequestHeader('X-CSRF-Token', token);
      });
    }
  },
};
