a = """ 



<div class="meta              ">
<div class="buttons"><a class="btn btn-large btn-primary prev" href="#">Prev</a>
<a class="btn btn-large btn-primary open-gallery" href="#">Open Gallery</a>
<span class="slides"><span class="total">9</span><span class="current">1</span></span><a class="btn btn-large btn-primary next" href="#">Next</a>
</div><h2 class="title">The Face of Android Wear</h2><div class="caption"><p>
The Motorola Moto 360 is the first Android Wear smartwatch with a round face. And it's beautiful.</p></div><div class="credit    "></div></div>


"""





p = a.splitlines()
ans = '' 
for i in range(len(p)):
	if len(p[i]) == 0:
		continue 
	x = p[i].strip()
	ans += x 

print ans

print '\n\nremoving the spaces ....... ++++++++ inserting \ for escape characters \n'


# for removing the spaces between any 'name ="....."  name .... Since the spiliting happens around spaces/tabs also ...   
final = ''
l = len(ans) 
i = 0 
while(i < l):
	if ans[i] == '"' :
		final += ans[i]
		while(1):
			i = i + 1
			if ans[i] == '"' :
				final += ans[i]
				break 
			if ans[i] == ' ' or ans[i] == '\t': 
				continue 
			else : 
				final += ans[i]
	else : 
	  	# for making apostrophe as an escape character e.g making ' it's ---> it\'s '  
	  	if i+1 < l and ans[i+1] == "'": 
	  		final += ans[i]
	  		final += '\\' 
	  	else :
			final += ans[i]
	i = i + 1

print final 
