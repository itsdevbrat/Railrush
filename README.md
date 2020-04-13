# Railrush
An AI based Crowd Detection that detects number of peoples in the trains 

# Tech Stack
Admin Frontend : HTML, CSS, JS  <a href="http://http://52.23.201.69/">website link</a><br>
Client Frontend : Android  <a href="https://github.com/itsdevbrat/RailrushAndroid">website link</a><br>
Backend : Node.js, mongodb, python(ML Scrpt)<br>

# Flow
When user uploads a video on website <a href="http://http://52.23.201.69/">website link</a> the video on reaching the servers gets processed and we count number of peoples and using a formula we somehow calculate the current crowd count in the train and then those crowd count is made available at api call /crowdCount?trainId<br>
So the user client built using android get the crowd count for the train desired

# Instructions 
1. Install node
2. Install python 3.7 because tensorflow isn't there for 3.8 yet
3. npm install or npm install -y (within the project directory)
4. pip install opencv-python h5py keras tensorflow==2 matplotlib pillow numpy
5. npm app.js (within the project directory)
6. on browser got to localhost:3000 to get the video upload page
7. on browser got to localhost:3000/crowdCount/1 to get the count
