+++
title = "Jupyter Notebook Basics"
date = 2016-11-09T19:37:42-08:00
draft = false

# Tags and categories
# For example, use `tags = []` for no tags, or the form `tags = ["A Tag", "Another Tag"]` for one or more tags.
tags = ["learn", "python", "iPython", "jupyter", "notebook", "lynda"]
categories = ["cheat-sheet", "tutorial", "instructional", "notebook"]

# Featured image
# Place your image in the `static/img/` folder and reference its filename below, e.g. `image = "example.jpg"`.
[header]
image = "jupyterNotebookBasics.jpg"
caption = "A few basic reminders on working within a Jupyter Notebook"

+++

Some notes to keep handy as a reminder of the basics in using a Jupyter notebook
# What is a Jupyter notebook?

According to the [Web App's main page](//jupyter.org): _The Jupyter Notebook is an open-source web application that allows you to create and share documents that contain live code, equations, visualizations and explanatory text. Uses include: data cleaning and transformation, numerical simulation, statistical modeling, machine learning and much more._

**In my own words:** _Application for creating and sharing documents that contain:_

- live code
- equations
- visualizations
- explanatory text

Home page: http://jupyter.org/

# Notebook tutorials
_Handy write ups on specific skills or applications of Jupyter Notebooks_

- [Quick Start Guide](https://jupyter-notebook-beginner-guide.readthedocs.io/en/latest/)
  - Brief tutorial on installing and running notebooks on a local computer with no python familiarity assumed
- [User Documentation](http://jupyter-notebook.readthedocs.io/en/latest/)
  - User documentation on setup and configuration
- [Examples Documentation](http://jupyter-notebook.readthedocs.io/en/latest/examples/Notebook/examples_index.html)
  - Jupyter docs with Notebook examples for definitions
- [Cal Tech](http://bebi103.caltech.edu/2015/tutorials/t0b_intro_to_jupyter_notebooks.html)
  - Content intro from Markdown and Latex to [interactive plotting with bokeh](http://bebi103.caltech.edu.s3-website-us-east-1.amazonaws.com/2015/tutorials/t0b_intro_to_jupyter_notebooks.html#Interactive-plotting-with-Bokeh)

# Notebook Users
- students, readers, viewers, learners
    - read a digital book
    - interact with a "live" book
- notebook developers
    - create notebooks for students, readers, ...

# Notebooks cells
_Notebooks are composed of cells. These can be modified for myriad forms of content_

- Code cells
    - execute interactively on computer (Python, or many other languages)
    - memory across notebook (variable from one cell can be used in a later)
- Markdown cells
    - documentation / "narrative" cells
        - Can be used to decorate and guide a reader through a notebook

All cells have the following basic structure:
```javascript
{
  "cell_type" : "name",
  "metadata" : {},
  "source" : "single string or [list, of, strings]",
}
```


## Markdown cells
*markdown, as defined in [GitHub-flavored markdown](https://help.github.com/articles/github-flavored-markdown), and implemented in [marked](https://github.com/chjj/marked)*

```javascript
{
  "cell_type" : "markdown",
  "metadata" : {},
  "source" : ["some *markdown*"],
}
```

## Code cells
*contain source code in the language of the document’s associated kernel, and a list of outputs associated with executing that code. They also have an execution_count, which must be an integer or null*

```javascript
{
  "cell_type" : "code",
  "execution_count": 1, # integer or null
  "metadata" : {
      "collapsed" : True, # whether the output of the cell is collapsed
      "autoscroll": False, # any of true, false or "auto"
  },
  "source" : ["some code"],
  "outputs": [{
      # list of output dicts (described below)
      "output_type": "stream",
      ...
  }],
}
```

### Code cell outputs
*code cell outputs correspond to messages produced as a result of executing the cell*

#### stream output
```javascript
{
  "output_type" : "stream",
  "name" : "stdout", # or stderr
  "text" : ["multiline stream text"],
}
```
_the keys `stream` key was changed to `name` to match the stream message in nbformat: 4.0_

#### display_data
*Rich display outputs, as created by display_data messages, contain data keyed by mime-type*
```javascript
{
  "output_type" : "display_data",
  "data" : {
    "text/plain" : ["multiline text data"],
    "image/png": ["base64-encoded-png-data"],
    "application/json": {
      # JSON data is included as-is
      "json": "data",
    },
  },
  "metadata" : {
    "image/png": {
      "width": 640,
      "height": 480,
    },
  },
}
```

# Following cells are "live" cells


```python
print ("Hello Jupyter World!; You are helping me learn")
```

    Hello Jupyter World!; You are helping me learn



```python
(5+7)/4
```




    3




```python
import numpy as np
my_first_array = np.arange(11)
print (my_first_array)
```

    [ 0  1  2  3  4  5  6  7  8  9 10]
