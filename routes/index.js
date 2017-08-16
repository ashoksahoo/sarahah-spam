var express = require('express');
var _ = require('lodash');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Sarahah Spammer'});
});
router.post('/*', function (req, res, next) {
    console.warn(req.body);
    spam(req.body.users, req.body.msg);
    res.render('thanks', {title: 'Sarahah Spammer'});
});

module.exports = router;

function spam(users, msg) {
    var users_to_attack = formatUsers(users);
    console.log(users_to_attack);
    _.each(users_to_attack, function (user) {
        spamUser(user, msg)
    })

}

function spamUser(user, msg) {
    var cookieJar = request.jar();
    var homeUrl = 'https://' + user + '.sarahah.com/';
    request.get(homeUrl, {jar: cookieJar}, function (error, response, body) {
        var csrfToken = body.split('<input name="__RequestVerificationToken" type="hidden" value="')[1].split('"')[0];
        var profileId = body.split('<input id="RecipientId" type="hidden" value="')[1].split('"')[0];
        var msgUrl = homeUrl + 'Messages/SendMessage';
        var headers = {
            'Origin': 'https://' + user + '.sarahah.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*',
            'Referer': 'https://' + user + '.sarahah.com/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.8',
            'X-Requested-With': 'XMLHttpRequest'
        };
        var data = {
            '__RequestVerificationToken': csrfToken,
            'userId': profileId,
            'text': msg
        };
        request.post({
            method: "POST",
            headers: headers,
            formData: data,
            uri: msgUrl,
            jar: cookieJar
        })
    });
}

function formatUsers(users) {
    return _.uniq(_.compact(users.split(',')));
}