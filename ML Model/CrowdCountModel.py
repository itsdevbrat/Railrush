import sys
#print(max , min , alreadyPT)

import cv2
import h5py
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
from matplotlib import cm as c
from keras.models import model_from_json
# from google.colab.patches import cv2_imshow
import time
import os

root_dir = os.path.dirname(__file__)

def load_model():
    # Function to load and return neural network model 
    json_file = open(os.path.join(root_dir,'Model/Model.json'), 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    loaded_model.load_weights(os.path.join(root_dir,'Model/model_A_weights.h5'))
    return loaded_model

def create_img(path):
    #Function to load,normalize and return image 
    # print(path)
    #im = Image.open(path).convert('RGB')

    im=cv2.imread(path)
    im=cv2.cvtColor(im,cv2.COLOR_BGR2RGB)
    im = cv2.rotate(im, cv2.ROTATE_90_CLOCKWISE)

    im = np.array(im)
    
    im = im/255.0
    
    im[:,:,0]=(im[:,:,0]-0.485)/0.229
    im[:,:,1]=(im[:,:,1]-0.456)/0.224
    im[:,:,2]=(im[:,:,2]-0.406)/0.225


    im = np.expand_dims(im,axis  = 0)
    return im

start = time.time()

model = load_model()

end = time.time()
# print(end-start)

def predict(path):
    #Function to load image,predict heat map, generate count and return (count , image , heat map)
    # model = load_model()
    image = create_img(path)
    ans = model.predict(image)
    count = np.sum(ans)
    #cv2_imshow(image)
    return count,image,ans

def detect(path):
  ans,img,hmap = predict(path)
  return ans



#Frame creator function
def getFrame(sec):
    cap.set(cv2.CAP_PROP_POS_MSEC,sec*1000)
    hasFrames,image = cap.read()
    if hasFrames:
      #detect(image)
        cv2.imwrite(os.path.join(root_dir,'data4/'+sys.argv[1]+"/"+str(sec)+' sec.jpg'), image) 
            # save frame as JPG file
    return hasFrames

# Playing video from file:
start = time.time()
cap = cv2.VideoCapture(os.path.join(root_dir,'../Video Uploads/'+sys.argv[1]))

sec = 0
frameRate = 2
#it will capture image in each 0.5 second
os.mkdir(os.path.join(root_dir,'data4/'+sys.argv[1]))
success = getFrame(sec)
while success:
    sec = sec + frameRate
    sec = round(sec, 2)
    success = getFrame(sec)
cap.release()
cv2.destroyAllWindows()
end = time.time()
# print(end - start)



import glob
start = time.time()
# add = os.path.join(root_dir,'data4')
getpath=os.path.join(root_dir,'data4/'+sys.argv[1])
# print(getpath)
path_sets=[getpath]
img_paths = []

for path in path_sets:
    
    for img_path in glob.glob(os.path.join(path, '*.jpg')):
        
        img_paths.append(str(img_path))
        
# print("Total images : ",len(img_paths))
end = time.time()
# print(end - start)

start = time.time()
img=1
max_value=0
min_value=100000
platform_max=0

for img_path in img_paths:
  # print(img)
  ans=detect(img_path)

  if img < 10:
    platform_max = ans if ans > platform_max else platform_max

  min_value = ans if min_value > ans else min_value
  max_value = ans if max_value < ans else max_value

  img=img+1

end = time.time()
# print(end-start)

print(str(max_value),",",str(min_value),",",str(platform_max))

