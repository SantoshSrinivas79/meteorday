Router.plugin('loading', {
    loadingTemplate: 'loading'
});


Router._filters = {
    isLoggedIn: function(pause) {
        if (!(Meteor.loggingIn() || Meteor.user())) {
            this.render('login');
            pause();
            return;
        }

        this.next();
    },

    isOnline: function(pause){
        if(navigator.network && navigator.network.connection){
            if(navigator.network.connection.type === Connection.NONE){
                this.render('offline');
                pause();
                return;
            }
        }

        this.next();
    }
};

var filters = Router._filters;

if(Meteor.isCordova){
    Router.onBeforeAction(filters.isOnline);
    Router.onBeforeAction(filters.isLoggedIn, { only: ['checkins'] });
}

Router.map(function () {
    
    if(Meteor.isCordova){
        this.route('checkins', { path: '/', controller: CheckinsController });
    } else {
        this.route('dashboard', { path: '/', controller: DashboardController });
        this.route('playback', { path: '/playback', controller: PlaybackController });
        this.route('checkinsByCity', { path: '/checkins/:city/:id', controller : CheckinsByCityController });
    }

    
    this.route('login', { path: '/login', controller: LoginController });
    
    // loading and offline routes are for convenience (style/debug templates)
    this.route('loading', { path: '/loading'});
    this.route('offline', { path: '/offline'});

    // convenience route for testing checkins on desktop browsers
    if(!Meteor.isCordova){
        this.route('checkins', { path: '/checkins', controller: CheckinsController });
    }
});