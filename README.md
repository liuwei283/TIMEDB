# Welcome to TIMEDB

## Platform Introduction

**[TIMEDB](https://timedb.deepomics.org), an online human tumor immune micro-environment cell composition database with automatic analysis and interactive visualization**. 

We have systematically searched gene expression datasets of 43 cancer types from TCGA, Therapeutically Applicable Research to Generate Effective Treatments (TARGET), Gene Expression Omnibus (GEO), and Array Express portal from June 2021 - June 2022. As a result, we collected the RNA expression profiles from a total of **39,706** samples from **546** datasets of **43** cancer types. We manually curated the corresponding clinical information (treatment, survival, etc.) from different data sources to the same format, which at least three individuals have independently validated. 

<img src="/public/docs/database.png" style="width:60%; margin: 15px;">

We conducted TIME cell-type composition estimation using **ten state-of-the-art tools**, including ABIS, CIBERSORT, CIBERSORTx, EPIC, quanTIseq, TIMER, ConsensusTME, ImmuneCellAI, MCPcounter, and xCell. All processed expression data, curated clinical data, and TIME cell-type composition data are freely downloadable on TIMEDB. Furthermore, TIMEDB offers an automatic TIME analysis workflow, including the above-mentioned TIME cell-type composition estimation packages, TIME cell-type composition guided patient subtyping, survival analysis, correlation analysis, differential expression analysis, etc. Users can upload their gene expression data or select datasets from TIMEDB for independent or integrated analyses with simple mouse operations. 

<img src="/public/docs/analysis.png" style="width:60%; margin: 15px;">


Last but not least, TIMEDB supports the **interactive visualizations** of gene expression, TIME cell-type composition estimation, patient subtyping, survival, and correlation data from databases or analyses. Multiple interaction options are available, including informative tooltips, changeable plot size, edited labels, optional color picker, etc. All visualizations are downloadable in high-quality publication-ready format. 

<img src="/public/docs/visualization.png" style="width:60%; margin: 15px;">

## Installation Guide

### Prerequisites

#### 0. [Homebrew](https://brew.sh/)

``` bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 1. Ruby

1. install rbenv

  ```
brew install rbenv
  ```

2. install __Ruby 2.7.1__ (for the latest TIMEDB realeased version)

  ```
rbenv install 2.7.1
  ```

  **Note**: Please check to guarantee that Ruby and Gem packages are under the control of Rbenv

  ```console
user@users-iMac meta_platform % which ruby
/Users/user/.rbenv/shims/ruby
user@users-iMac meta_platform % gem env home
/Users/user/.rbenv/versions/2.7.1/lib/ruby/gems/2.7.0
  ```

>! wrong example here, the default ruby is the system ruby
>
>```console
>user@dclb4027 ide-frontend % gem env home
>/Library/Ruby/Gems/2.6.0
>```


### 2. Node and Yarn

1. install __[Node](https://nodejs.org/en/download/package-manager/)__ 14

  ``` bash
  # using homebrew
  brew install node@14

  # or using nvm
  # you might need to manually set the environment
  brew install nvm
  nvm install 14.17.0
  ```

  **Validation**

  ``` shell-session
user@users-iMac meta_platform % node -v
v14.17.0
  ```

2. install  __[Yarn](https://yarnpkg.com/en/docs/install)__

  ```
npm install --global yarn
  ```

### 3. __[PostgreSQL](https://www.postgresql.org/download/)__ as the backend database

1. install postgresql. Pay attention to the [support OS versions](https://www.postgresql.org/download/macosx/).

  ```bash
# here we use 12, but you may also try later versions if your os suppport
brew install postgresql@12
brew services start postgresql@12
  ```

**Note**: Choose the right version of postgresql for your OS

### Project Initialization

#### 0. Get the project

Create an account in http://144.214.37.165/ (please contact the gitlab manager)

create suitable workspace folder and clone the project to your local environement with all prerequisites satisfied.

```bash
git clone git@144.214.37.165:wangxueying/timedb.git
```

Now _go to the project root_:

```bash
cd immune_platform
```

#### 1. Install dependencies

0. install bundler as the dependency manager:

   ```bash
   gem install bundler
   ```

1. Install all ruby dependencies:

   ```bash
   bundle install
   ```

2. `cd ..` to your _**$workspace**_, clone and install crux.

   ```bash
   #clone wyf-dev branch for the latest functions at this moment
   git clone -b wyf-dev https://delta.cs.cityu.edu.hk/lhc/crux.git
   cd crux
   yarn install
   yarn build
   ```

3. Download **oviz-editor** [oviz-editor-v0.1.0.tgz](http://144.214.37.165/lhc/oviz-editor/-/tags)

4. Install all front-end dependencies using _yarn_:

   ```bash
   yarn install
   ```

  **Note**: the file structure of your workspace should be as the follows

    --your workspace
      --crux
      --meta_platform
      --oviz-editor-v0.1.0.tgz


### 2. Create database user

The database configuration can be checked in`config/database.yml`, including the user name and the database name.

Create the required user name stated in the database configuration file:

```bash
createuser --interactive
```

Then read the output of  `brew info postgresql` to start the database.


### 3. Setup database

Run the following commands to construct the project database.

  ```bash
bin/rails db:create
bin/rails db:migrate
  ```

### 4. Start local server

Run the following command to launch your local server.

```bash
rails s
# open a new terminal tab and ran the second command
bin/webpack-dev-server
```

Go to [localhost:3000](localhost:3000) where you can check the local version of the platform.

## Development Guide

### Upload data

TIMEDB provides [administration pages](http://localhost:3000/admin/) for developers to upload new datasets and conduct necessary data processing procedures. Detailed data processing codes can be added, modified and improved in the administration controller.

### Analysis Configuration

The latest version of TIMEDB support multiple visualization module for each analysis type. Detaield procedures for the analysis configuration are as follows:

1. Configure corresponding visualizers in [visualizer administration pages](http://localhost:3000/admin/visualizers)

   **Note**: Configured data sources should be synchronized with visualization developers.

2. Complete construction of analysis modules in DeepOmics
3. Create and configure the new analysis in [analysis administration pages](https://timedb.deepomics.org/admin/analyses)
   - Select corresponding visualizers (should be completed in the fist step)
   - Configure the required json file, in which each file key should match with some output files fetched from DeepOmics.

4. Submit a task and check detailed information in DeepOmics.

### Deployment Procedure

1. make a new directory for your project in the 380 server, such as immune_platform

2. modify files under the config folder, including

   - config/deploy/production.rb
   - config/environments/development.rb
   - config/environments/production.rb
   - config/database.yml
   - config/deploy.rb

   **Note**: the default branch of the project should be synchronized with the deployed branch.

``` rb
set :application, "timedb"
set :repo_url, "git@gitlab.deepomics.org:xxx"
set :branch, proc { `git rev-parse --abbrev-ref xxx`.chomp } #！！！
```

3. copy the shared folder from recom-rails and modify the following files:

   - .env
   - database.yml
   - puma.rb
   - xxx (please recheck each file)

4. create the database whose detailed configuration information can be checked in the database.yml file (production environment)

   - create user name:`sudo -u postgres createuser xxx`
   - give created user the permission to create the database
   - create database

5. modify apache configuration to create new virtual host

   - `/usr/local/apache2/conf/extra/httpd-ssl.conf`
   - `/usr/local/apache2/conf/httpd.conf`

   then restart the apachectl:  `bin/apachectl restart`

6. Start to deploy

   `cap production deploy`

### How to use the platform

We provides user guides for each functional component of the platform at [tutorial pages](https://timedb.deepomics.org/docs#/). If you have any suggestion, please contact us for future improving.

## Contact us

**Bug report**

If you encounter any problems in use, you can describe it on the [issue](https://github.com/deepomicslab/TIMEDB/issues) page and we will deal with it as soon as possible.

**Supervisor**

Dr LI, Shuaicheng
Tat Chee Avenue, Kowloon, Hong Kong
Email: shuaicli@cityu.edu.hk

## Citation

<pre>
@article{10.1093/nar/gkac1006,
    author = {Wang, Xueying and Chen, Lingxi and Liu, Wei and Zhang, Yuanzheng and Liu, Dawei and Zhou, Chenxin and Shi, Shuai and Dong, Jiajie and Lai, Zhengtao and Zhao, Bingran and Zhang, Wenjingyu and Cheng, Haoyue and Li, Shuaicheng},
    title = "{TIMEDB: tumor immune micro-environment cell composition database with automatic analysis and interactive visualization}",
    journal = {Nucleic Acids Research},
    year = {2022},
    month = {11}}
</pre>