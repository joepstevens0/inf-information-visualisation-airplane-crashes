import geopy.geocoders                  # https://geopy.readthedocs.io/en/stable/
from geopy.geocoders import Nominatim   # https://nominatim.org/

geopy.geocoders.options.default_user_agent = "test-app"
# Time, in seconds, to wait for the geocoding service to respond before raising a geopy.exc.GeocoderTimedOut exception.
geopy.geocoders.options.default_timeout = 4
geolocator = Nominatim()

print(geolocator.headers)
print(geolocator.timeout)

location = geolocator.geocode("Mauritius")
print(location.address)
# Flatiron Building, 175, 5th Avenue, Flatiron, New York, NYC, New York, ...
print((location.latitude, location.longitude))
#(40.7410861, -73.9896297241625)
print(location.raw)
