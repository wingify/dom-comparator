# -*- coding: utf-8 -*-

import re 
a = """ 




<div id="login-form">
<div class="box-inner">

<form name="form" action="./" method="post">
<input type="hidden" name="_task" value="login"><input type="hidden" name="_action" value="login"><input type="hidden" name="_timezone" id="rcmlogintz" value="_default_"><input type="hidden" name="_dstactive" id="rcmlogindst" value="_default_"><input type="hidden" name="_url" id="rcmloginurl" value=""><table><tbody><tr><td class="title"><label for="rcmloginuser">Username</label>
</td>
<td class="input"><input name="_user" id="rcmloginuser" size="40" autocapitalize="off" type="text"></td>
</tr>
<tr><td class="title"><label for="rcmloginpwd">Password</label>
</td>
<td class="input"><input name="_pass" id="rcmloginpwd" size="40" autocapitalize="off" type="password"></td>
</tr>
</tbody>
</table>

NICE
<p class="formbuttons"><input type="submit" class="button mainaction" value="Login" /></p>

</form>
</div>

<img src="skins/larry/images/IIIT_logo.png" id="logo" border="0" alt="Students Mail Server">
<div class="box-bottom" style="color:red;">
<div id="m"></div>
</div>





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
