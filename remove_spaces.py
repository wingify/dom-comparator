a = """ 


<a href="#" data-suid="30345976" class="tab-change " data-b="_ylt=A2KLtXJObqlTcGEAflGuitIF" id="tab-p_30345976">               <span class="world-cup"><b class="wc-text">World Cup</b>
               <span class="next-game fz-xxs">Next up</span><span class="name ell">Costa Rica</span><img src="https://sp.yimg.com/j/assets/i/us/sp/v/soccer/teams/70x70/443.png" alt="" class="team-icon"><span class="vs">v</span><img src="https://sp.yimg.com/j/assets/i/us/sp/v/soccer/teams/70x70/377.png" alt="" class="team-icon"><span class="name ell">England</span></span></a>






	       <a href="da" class="tab" data-b="ylt" id="tab">
	       <span class="world">
	       <b class="wc">World</b>
	       <span class="n">Next up</span>
	       <span class="n">Costa Rica</span>
	       <img src="hi" class="team-icon">
	       <span class="vs">v</span>
	       <img src="Hi" alt="" class="team-icon">
	       <span class="name">Eng</span>
	       </span>
	       </a>


"""









p = a.splitlines()
ans = '' 
for i in range(len(p)):
	if len(p[i]) == 0:
		continue 
	x = p[i].strip()
	ans += x 

print ans 
