;(function() {
  var template = Handlebars.template,
    templates = (Handlebars.templates = Handlebars.templates || {})
  templates['mail-body.hbs'] = template({
    compiler: [7, '>= 4.0.0'],
    main: function(container, depth0, helpers, partials, data) {
      return '<table role="presentation" class="main">\n  <tr>\n    <td class="wrapper">\n      <table role="presentation" border="0" cellpadding="0" cellspacing="0">\n        <tr>\n          <td>\n            <p>Hi there,</p>\n            <p>\n              Sometimes you just want to send a simple HTML email with a simple\n              design and clear call to action. This is it.\n            </p>\n            <table\n              role="presentation"\n              border="0"\n              cellpadding="0"\n              cellspacing="0"\n              class="btn btn-primary"\n            >\n              <tbody>\n                <tr>\n                  <td align="left">\n                    <table\n                      role="presentation"\n                      border="0"\n                      cellpadding="0"\n                      cellspacing="0"\n                    >\n                      <tbody>\n                        <tr>\n                          <td>\n                            <a href="http://htmlemail.io" target="_blank"\n                              >Call To Action</a\n                            >\n                          </td>\n                        </tr>\n                      </tbody>\n                    </table>\n                  </td>\n                </tr>\n              </tbody>\n            </table>\n            <p>\n              This is a really simple email template. Its sole purpose is to get\n              the recipient to click the button with no distractions.\n            </p>\n            <p>Good luck! Hope it works.</p>\n          </td>\n        </tr>\n      </table>\n    </td>\n  </tr>\n</table>\n'
    },
    useData: true,
  })
  templates['mail-footer.hbs'] = template({
    compiler: [7, '>= 4.0.0'],
    main: function(container, depth0, helpers, partials, data) {
      return '<div class="footer">\n  <table role="presentation" border="0" cellpadding="0" cellspacing="0">\n    <tr>\n      <td class="content-block powered-by">\n        Sent by <a href="https://blicc.org">blicc.org</a>\n      </td>\n    </tr>\n  </table>\n</div>\n'
    },
    useData: true,
  })
  templates['mail.hbs'] = template({
    compiler: [7, '>= 4.0.0'],
    main: function(container, depth0, helpers, partials, data) {
      var helper,
        alias1 = depth0 != null ? depth0 : container.nullContext || {},
        alias2 = helpers.helperMissing,
        alias3 = 'function',
        alias4 = container.escapeExpression

      return (
        '<!DOCTYPE html>\n<html>\n  <head>\n    <meta name="viewport" content="width=device-width" />\n    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n    <title>' +
        alias4(
          ((helper =
            (helper =
              helpers.title || (depth0 != null ? depth0.title : depth0)) != null
              ? helper
              : alias2),
          typeof helper === alias3
            ? helper.call(alias1, { name: 'title', hash: {}, data: data })
            : helper)
        ) +
        "</title>\n    <style>\n      img {\n        border: none;\n        -ms-interpolation-mode: bicubic;\n        max-width: 100%;\n      }\n      body {\n        background-color: #f6f6f6;\n        font-family: sans-serif;\n        -webkit-font-smoothing: antialiased;\n        font-size: 14px;\n        line-height: 1.4;\n        margin: 0;\n        padding: 0;\n        -ms-text-size-adjust: 100%;\n        -webkit-text-size-adjust: 100%;\n      }\n      table {\n        border-collapse: separate;\n        width: 100%;\n      }\n      table td {\n        font-family: sans-serif;\n        font-size: 14px;\n        vertical-align: top;\n      }\n      .body {\n        background-color: #f6f6f6;\n        width: 100%;\n      }\n      .container {\n        display: block;\n        margin: 0 auto !important;\n        max-width: 580px;\n        padding: 10px;\n        width: 580px;\n      }\n      .content {\n        box-sizing: border-box;\n        display: block;\n        margin: 0 auto;\n        max-width: 580px;\n        padding: 10px;\n      }\n      .main {\n        background: #ffffff;\n        border-radius: 3px;\n        width: 100%;\n      }\n      .wrapper {\n        box-sizing: border-box;\n        padding: 20px;\n      }\n      .content-block {\n        padding-bottom: 10px;\n        padding-top: 10px;\n      }\n      .footer {\n        clear: both;\n        margin-top: 10px;\n        text-align: center;\n        width: 100%;\n      }\n      .footer td,\n      .footer p,\n      .footer span,\n      .footer a {\n        color: #999999;\n        font-size: 12px;\n        text-align: center;\n      }\n      h1,\n      h2,\n      h3,\n      h4 {\n        color: #000000;\n        font-family: sans-serif;\n        font-weight: 400;\n        line-height: 1.4;\n        margin: 0;\n        margin-bottom: 30px;\n      }\n      h1 {\n        font-size: 35px;\n        font-weight: 300;\n        text-align: center;\n        text-transform: capitalize;\n      }\n      p,\n      ul,\n      ol {\n        font-family: sans-serif;\n        font-size: 14px;\n        font-weight: normal;\n        margin: 0;\n        margin-bottom: 15px;\n      }\n      p li,\n      ul li,\n      ol li {\n        list-style-position: inside;\n        margin-left: 5px;\n      }\n      a {\n        color: #3498db;\n        text-decoration: underline;\n      }\n      .btn {\n        box-sizing: border-box;\n        width: 100%;\n      }\n      .btn > tbody > tr > td {\n        padding-bottom: 15px;\n      }\n      .btn table {\n        width: auto;\n      }\n      .btn table td {\n        background-color: #ffffff;\n        border-radius: 5px;\n        text-align: center;\n      }\n      .btn a {\n        background-color: #ffffff;\n        border: solid 1px #3498db;\n        border-radius: 5px;\n        box-sizing: border-box;\n        color: #3498db;\n        cursor: pointer;\n        display: inline-block;\n        font-size: 14px;\n        font-weight: bold;\n        margin: 0;\n        padding: 12px 25px;\n        text-decoration: none;\n        text-transform: capitalize;\n      }\n      .btn-primary table td {\n        background-color: #3498db;\n      }\n      .btn-primary a {\n        background-color: #3498db;\n        border-color: #3498db;\n        color: #ffffff;\n      }\n      .last {\n        margin-bottom: 0;\n      }\n      .first {\n        margin-top: 0;\n      }\n      .align-center {\n        text-align: center;\n      }\n      .align-right {\n        text-align: right;\n      }\n      .align-left {\n        text-align: left;\n      }\n      .clear {\n        clear: both;\n      }\n      .mt0 {\n        margin-top: 0;\n      }\n      .mb0 {\n        margin-bottom: 0;\n      }\n      .preheader {\n        color: transparent;\n        display: none;\n        height: 0;\n        max-height: 0;\n        max-width: 0;\n        opacity: 0;\n        overflow: hidden;\n        visibility: hidden;\n        width: 0;\n      }\n      .powered-by a {\n        text-decoration: none;\n      }\n      hr {\n        border: 0;\n        border-bottom: 1px solid #f6f6f6;\n        margin: 20px 0;\n      }\n      @media only screen and (max-width: 620px) {\n        table[class='body'] h1 {\n          font-size: 28px !important;\n          margin-bottom: 10px !important;\n        }\n        table[class='body'] p,\n        table[class='body'] ul,\n        table[class='body'] ol,\n        table[class='body'] td,\n        table[class='body'] span,\n        table[class='body'] a {\n          font-size: 16px !important;\n        }\n        table[class='body'] .wrapper,\n        table[class='body'] .article {\n          padding: 10px !important;\n        }\n        table[class='body'] .content {\n          padding: 0 !important;\n        }\n        table[class='body'] .container {\n          padding: 0 !important;\n          width: 100% !important;\n        }\n        table[class='body'] .main {\n          border-left-width: 0 !important;\n          border-radius: 0 !important;\n          border-right-width: 0 !important;\n        }\n        table[class='body'] .btn table {\n          width: 100% !important;\n        }\n        table[class='body'] .btn a {\n          width: 100% !important;\n        }\n        table[class='body'] .img-responsive {\n          height: auto !important;\n          max-width: 100% !important;\n          width: auto !important;\n        }\n      }\n      @media all {\n        .ExternalClass {\n          width: 100%;\n        }\n        .ExternalClass,\n        .ExternalClass p,\n        .ExternalClass span,\n        .ExternalClass font,\n        .ExternalClass td,\n        .ExternalClass div {\n          line-height: 100%;\n        }\n        .apple-link a {\n          color: inherit !important;\n          font-family: inherit !important;\n          font-size: inherit !important;\n          font-weight: inherit !important;\n          line-height: inherit !important;\n          text-decoration: none !important;\n        }\n        #MessageViewBody a {\n          color: inherit;\n          text-decoration: none;\n          font-size: inherit;\n          font-family: inherit;\n          font-weight: inherit;\n          line-height: inherit;\n        }\n        .btn-primary table td:hover {\n          background-color: #34495e !important;\n        }\n        .btn-primary a:hover {\n          background-color: #34495e !important;\n          border-color: #34495e !important;\n        }\n      }\n    </style>\n  </head>\n  <body class=\"\">\n    <table\n      role=\"presentation\"\n      border=\"0\"\n      cellpadding=\"0\"\n      cellspacing=\"0\"\n      class=\"body\"\n    >\n      <tr>\n        <td class=\"container\">\n          <div class=\"content\">\n            " +
        alias4(
          ((helper =
            (helper =
              helpers.main || (depth0 != null ? depth0.main : depth0)) != null
              ? helper
              : alias2),
          typeof helper === alias3
            ? helper.call(alias1, { name: 'main', hash: {}, data: data })
            : helper)
        ) +
        '\n            ' +
        alias4(
          ((helper =
            (helper =
              helpers.footer || (depth0 != null ? depth0.footer : depth0)) !=
            null
              ? helper
              : alias2),
          typeof helper === alias3
            ? helper.call(alias1, { name: 'footer', hash: {}, data: data })
            : helper)
        ) +
        '\n          </div>\n        </td>\n      </tr>\n    </table>\n  </body>\n</html>\n'
      )
    },
    useData: true,
  })
})()
