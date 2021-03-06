'use strict';

var $ = require('jquery');

require('jquery-magnific-popup');
require('jquery-serializeObject');
require('jquery-utils');

var updateInputState = require('./common.js').updateInputState;


var agreement = {

  init: function (url) {
    this.url = url;

    $(document).on('click', '.js-agreement-popup', this.displayContent.bind(this));
    $(document).on('submit', '.js-agreement-form', this.onSubmit.bind(this));

    this.display();
  },

  display: function () {
    $.magnificPopup.open({
      items: {
        src: this.url,
        type: 'ajax'
      },
      callbacks: {
        parseAjax: function (mfpResponse) {
          mfpResponse.data = mfpResponse.data.form;
        },
        ajaxContentAdded: function () {
          updateInputState('.js-legalfield', '.js-agreement-continue');
        }
      },
      modal: true
    });
  },

  displayContent: function (e) {
    e.preventDefault();

    var that = this;
    var url = e.target.href;

    $.magnificPopup.close();
    $.magnificPopup.open({
      items: {
        src: url,
        type: 'ajax'
      },
      callbacks: {
        afterClose: that.display.bind(that)
      },
      mainClass: 'popup-ajax'
    });
  },

  onSubmit: function (e) {
    e.preventDefault();

    var $agreementBox = $('.js-agreement-box'),
        $agreementForm = $('.js-agreement-form');
    $agreementBox.spin();
    $agreementBox.css({opacity: 0.5});

    $.ajax({
      url: $agreementForm.attr('action'),
      type: 'POST',
      data: $agreementForm.serializeObject(),
      success: function (data) {
        $.magnificPopup.close();
      },
      complete: function (xhr) {
        $agreementBox.spin(false);
        $agreementBox.css({opacity: 1});

        if (xhr.status === 400) {
          var form = $.parseJSON(xhr.responseText).form;
          $agreementBox.parent().html(form);
        }
      }
    });
  }

};


module.exports = agreement;
