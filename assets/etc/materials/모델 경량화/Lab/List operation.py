import numpy as np
import time

size = 1000000

lst = range(size)
initial_time = time.time()
result_list = [(a*b)for a,b in zip(lst, lst)]
print(round(time.time() - initial_time, 4), "seconds")

array = np.arange(size)
initial_time = time.time()
result_array = array * array
print(round(time.time() - initial_time, 4), "seconds")
