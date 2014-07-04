# -*- coding: utf-8 -*-

import re 
a = """ 





<footer id="footer">
<div class="constrain">
<section class="about  vwo_1404473313655">
<img alt="Desiring God" class="dg-mark" height="26" src="http://cdn0.desiringgod.org/assets/badges/dg-symbol-white-49c779279c329752d1a0748c7cfa4f98.png" width="26">
<h2>God is most glorified in us when we are most satisfied in him</h2>
<a class="button inverted" href="/about">
Learn more
<i class="icon-right-notch"></i>
</a>
  <div> himanshu </div>
  <p class="copyright">© 2014 Desiring God</p>
  </section>
  <section class="social-links">
  <p>
  <i class="icon-twitter"></i>
  <a href="http://twitter.com/johnpiper" target="_blank">@johnpiper</a>
  <br>
  <a href="http://twitter.com/desiringgod" target="_blank">@desiringgod</a>
  </p>
  <p>
  <i class="icon-facebook"></i>
  <a href="http://facebook.com/johnpiper" target="_blank">John Piper</a>
  <br>
  <a href="http://facebook.com/desiringgod" target="_blank">Desiring God</a>
  </p>
  </section>
  <section class="subscribe">
  <h2 class="module-title">Email Updates</h2>
  <p>Receive email updates from Desiring God.</p>
  <div id="email_subscribe">
  <form accept-charset="UTF-8" action="/subscribe" data-remote="true" id="mc_subscribe" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="✓"></div>
  <div class="checkboxes">
  <div class="checkbox">
  <input id="blog" name="blog" type="checkbox">
  <label for="blog">Daily Blog</label>
  </div>
  <div class="checkbox">
  <input id="newsletter" name="newsletter" type="checkbox">
  <label for="newsletter">News &amp; Updates</label>
  </div>
  </div>
  <div class="email-and">
  <div class="text">
  <input class="textfield inverted" id="email_address" name="email_address" placeholder="Email Address" type="email">
  </div>
  <div class="submit">
  <input class="button inverted" type="submit" value="Subscribe">
  </div>
  </div>
  </form>


  </div>
  </section>
  <p class="show-on-phone-only copyright">© 2014 Desiring God</p>
  </div>
  </footer>





"""




p = a.splitlines()
ans = '' 
for i in range(len(p)):
	if len(p[i]) == 0:
		continue 
	x = p[i].strip()
	ans += x 

# to remove the spaces between any " >    < " ..... since spliting happens arount extra spaces .... 
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
