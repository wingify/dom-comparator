# -*- coding: utf-8 -*-

import re 
a = """ 


<ul>
<li class="menu__item is-leaf first leaf"><a href="/about-us/our-mission/privacy-policy" class="menu__link">Privacy policy</a></li>
<li class="menu__item is-leaf last leaf"><a href="/about-us/our-mission/community-guidelines" class="menu__link">Community guidelines</a></li>
<li class="menu__item is-leaf leaf"><a href="/about-us/our-mission/site-terms-use" class="menu__link">Terms of use</a></li>
</ul>



"""




p = a.splitlines()
ans = '' 
for i in range(len(p)):
	if len(p[i]) == 0:
		continue 
	x = p[i].strip()
	ans += x 

# to remove the spaces between any " >    < " ..... since spliting happens arount extra spaces .... 
#ans = re.sub(r'\s+([<"])', r'\1', ans)	
ans = re.sub(r'\s+([<"])', r'\1', ans)	
#print ans

#print '\n\nremoving the spaces ....... ++++++++ inserting \ for escape characters \n'


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

	  		if i+1 < l and ans[i+1] == "'": 
	  			final += ans[i]
	  			final += '\\' 
				continue

			if ans[i] == ' ' : 
				if ans[i+1].isalpha() :
					final += ans[i]
					continue 
				else : 
				 	continue 

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
