# Creative_Coding_2026_A3
Final Coding Project _ 'Word Waterfall'


‘Word Waterfall’ is inspired by ‘bit.fall’ (2005) by German artist Julius Popp, a permanent installation at MONA, Tasmania, in which water cascades downward to form computer-generated words; My sketch extends this idea into something more personal. I have created a word list that speaks to my experience of Tasmania: its wild, but calm nature, crisp air and coastal freshness. 

The code uses individual semi-transparent particles that mimic raindrops. Each particle operated through three states: fall, explode, toTarget – giving the sketch a rhythm of constant reformation. Particles fall into columns to maintain visual structure, then scatter on mouse click before forming a word. The mousePressed() function turns the piece into an unveiling; each click reveals another fragment of what home means to me. 

The p5.js code uses a text-to-point system to map text as point coordinates, with lerp() creating smooth transitions between states. Visual Studio Code’s AI assistance was used to troubleshoot logic and help achieve specific ideas, such as column snapping and state transitions. 

