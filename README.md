# CARCAS
## Carleton Archaeological Research Collection of Animal Specimens

This repository hosts the models and some of the code for 
Carleton's CARCAS project. 

Currently maintained by Digital Humanities Associates:


Previous maintainers:
- Erin Watson '24 watson.e.and@gmail.com
- Noah Zameer Lee '27 leen2@carleton.edu

Previous Digital Humanities Associates who worked on different versions of the codebase:
- Henry Burkhardth '26 burkhardth@carleton.edu
- Xingyi Zhang '24 zhangx3@carleton.edu

This is a work in process.

## How to use
This repository comes along with an annex and is best used 
using **Datalad** rather than git. For details, see 
Datalad's handbook: [https://handbook.datalad.org/en/latest/index.html]

1. Install datalad on your computer: [https://handbook.datalad.org/en/latest/intro/installation.html]
2. To clone the repository, run (all one line)
   
   ```datalad install --source https://github.com/DigitalCarleton/carcas.git --recursive```
4. To get a local copy of _all_ the models, (from within the `carcas` directory) run
   `datalad get carcas-models`
5. To get a local copy of just one model, specify the path to that model rather than the path to the entire folder after `datalad get`.

For more instructions for working with this repository if you are a 
Digital Humanities Associate, see the folder in the Shared Drive.
