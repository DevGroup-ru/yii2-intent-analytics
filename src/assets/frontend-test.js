$(function() {
  "use strict";
  intentAnalytics.init({
    'GoogleAnalytics': {
      'javascriptObjectName': 'ga'
    },
    'YandexMetrika': {
      'javascriptObjectName': 'yaCounter33933909'
    }
  });


  $("#goal-test").click(function() {

    //alert('Sending');

    intentAnalytics.track({
      'GoogleAnalytics': {
        'action': 'goal-test-button',
      },
      'YandexMetrika': {
        'goal': 'goal-test-button',
      }
    });

    //alert('Check network log, all should be ok');
    return false;
  });
});