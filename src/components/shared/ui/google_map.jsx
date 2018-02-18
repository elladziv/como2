import React from 'react';

class GoogleMap extends React.Component{
    constructor(props) {
        super(props);

        if(!props.id) {
            console.error('GoogleMap component must receive an \'id\' property!');
        } else {
            var address = '';
            var location = {lat: 40.730610, lng: -73.935242};
            if(props.address) {
                address = props.address
            }
            var mapStyle = [
                {"featureType":"landscape",
                    "stylers":[{"saturation":-100},
                        {"lightness":65},
                        {"visibility":"on"}]},
                {"featureType":"poi",
                    "stylers":[{"saturation":-100},
                        {"lightness":51},
                        {"visibility":"simplified"}]},
                {"featureType":"road.highway",
                    "stylers":[{"saturation":-100},
                        {"visibility":"simplified"}]},
                {"featureType":"road.arterial",
                    "stylers":[{"saturation":-100},
                        {"lightness":30},
                        {"visibility":"on"}]},
                {"featureType":"road.local",
                    "stylers":[{"saturation":-100},
                        {"lightness":40},
                        {"visibility":"on"}]},
                {"featureType":"transit",
                    "stylers":[{"saturation":-100},
                        {"visibility":"simplified"}]},
                {"featureType":"administrative.province",
                    "stylers":[{"visibility":"off"}]},
                {"featureType":"water",
                    "elementType":"labels",
                    "stylers":[{"visibility":"on"},
                        {"lightness":-25},
                        {"saturation":-100}]},
                {"featureType":"water",
                    "elementType":"geometry",
                    "stylers":[{"hue":"#ffff00"},
                        {"lightness":-25},
                        {"saturation":-97}]}
            ];

            this.state = {
                address: address,
                location: location,
                styles: mapStyle,
                marker: null,
                mapIcon: 'https://res.cloudinary.com/splacer/image/upload/c_scale,h_25/Production/Assets/search_page/map_pin.png',
                mapIconHover: 'https://res.cloudinary.com/splacer/image/upload/c_scale,h_25/Production/Assets/search_page/map_pin_selected.png',
            };
        }
    }

    componentDidMount() {
        window.sp.scriptLoader.loadGoogleMaps().then(function(){
            //trace('maps loaded');
            this.initMap();
            //
            if(this.state.address != '') {
                this.getLocation(this.state.address);
            }
        }.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        if(!nextProps.id) {
            console.error('GoogleMap component must receive an \'id\' property!');
            return false;
        }
        if(nextProps.address && nextProps.address != this.state.address) {
            this.setState({
                address: nextProps.address
            });
            //trace(nextProps.address);
            this.getLocation(nextProps.address);
        }
    }

    initMap() {
        if(typeof google != 'undefined') {
            var map = new google.maps.Map(document.getElementById(this.props.id), {
                center: this.state.location,
                styles: this.state.styles,
                fullscreenControl: false,
                scrollwheel: false,
                mapTypeControl: false,
                zoomControl: true,
                zoom: 13,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_TOP
                },
                scaleControl: false,
                streetViewControl: false,
            });
            var marker = new google.maps.Marker({
                map: map,
                position: this.state.location,
                icon: this.state.mapIcon,
                title: this.state.address,
            });
            var mi = this.state.mapIcon;
            var mih = this.state.mapIconHover;
            marker.addListener('mouseover', function(){
                this.setIcon(mih);
                this.setZIndex(10000);
            });
            marker.addListener('mouseout', function(){
                this.setIcon(mi);
                this.setZIndex(1);
            });
            //
            this.setState({
                map: map,
                marker: marker,
            });
        }
    }

    reposMap(location) {
        if(typeof google != 'undefined') {
            if(this.state.map) {
                this.state.map.setCenter(location);
                //
                if(this.state.marker) {
                    google.maps.event.clearInstanceListeners(this.state.marker);
                    this.state.marker.setMap(null);
                }
                //
                var marker = new google.maps.Marker({
                    map: this.state.map,
                    position: location,
                    icon: this.state.mapIcon,
                    title: this.state.address,
                });
                var mi = this.state.mapIcon;
                var mih = this.state.mapIconHover;
                marker.addListener('mouseover', function(){
                    this.setIcon(mih);
                    this.setZIndex(10000);
                });
                marker.addListener('mouseout', function(){
                    this.setIcon(mi);
                    this.setZIndex(1);
                });
                //
                this.setState({
                    marker: marker,
                });
            }
        }
    }

    getLocation(address) {
        if(typeof google != 'undefined') {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': address
            }, function(results, status) {
                if(status == google.maps.GeocoderStatus.OK) {
                    this.setState({
                        location: results[0].geometry.location
                    });
                    this.reposMap(results[0].geometry.location);
                }
            }.bind(this));
        }
    }

    render() {
        var cls = this.props.className ? this.props.className : '';
        return(
            <div id={this.props.id} className={'google-map '+cls}></div>
        );
    }
}

export default GoogleMap;
