require 'zip'

class WelcomeController < ApplicationController
  skip_before_action :validate_cookie, only: [:index, :tutorial ,:contact, :terms, :require_cookie]
  def index
    #@user = User.find(session[:user_id])
    @samples_num = Sample.all.count
    @cancers_num = Cancer.all.count
    @projects_num = Project.all.count
    @analysis_num = Analysis.all.count + AnalysisPipeline.all.count

    @function_level1 = ['TIME Estimation Category', 'Comparison Category', 'Other Category']
    @function_level2 = [['Regression Tools', 'Enrichment Tools', 'Unsupervised Tools', 'Consensus Tools'], ['Datasets Comparison', 'TIME Estimation Comparison'], ['Patient Subtyping', 'Survival Analysis', 'Correlation Analysis', 'Differential Expression']]
  end

  def tutorial
  end

  def contact
  end

  def terms
  end

  def test
    @analysis_user_datum = AnalysisUserDatum.find 180
    @analysis = @analysis_user_datum.analysis
    file_set = []
    files_info = @analysis.files_info
    files_info.each do |dataType, dataInfo| 
      next unless !dataInfo['demoFilePath'].blank?
      if dataInfo['demoFilePath'].class == String
        file_set << dataInfo['demoFilePath']
      else
        dataInfo['demoFilePath'].each do |fPath|
            file_set << fPath
          end
      end
    end
    if file_set.size == 1
        send_file File.join(Rails.root, file_set.values.first)
        return
    end

    compressed_filestream = Zip::OutputStream.write_buffer(::StringIO.new()) do |zos|
        file_set.each do |fpath|
          zos.put_next_entry File.basename(fpath)
          zos.write File.read(File.join(Rails.root, fpath))
        end
    end

    compressed_filestream.rewind
    send_data compressed_filestream.read, filename: "#{@analysis.name}.zip"
      

  end

  def require_cookie
    # no cookie found 

    unless session[:user_id]
        @user = User.new
        @user.dataset_n = 0
        @user.save
        session[:user_id] = @user.id
    end
    # check user
    id = session[:user_id]
    if User.exists? id
        @user = User.find(id)
        @user.touch

    else 
        # already expired
        @user = User.new
        @user.dataset_n = 0
        @user.save
        session[:user_id] = @user.id
    end

    logger.error session[:user_id]
    #user_dir = File.join($user_stor_dir, session[:user_id].to_s)  
    # unless File.directory?(user_dir)
    #     Dir.mkdir(user_dir)
    # end
    redirect_to root_path, notice: 'Welcome to use our website!'

  end
  def download
    csf_path = "#{Rails.root}/public/data/project_files.csv"
    csv_text = File.read(csf_path) 
    @csv_test = {}
    @attrs1 = ['Project','Gene expression data','meta data','scaled data']
    @attrs2 = ['Project','CIBERSORT','CIBERSORTX','ABIS','ImmuCellAI','xCell','ConsensusTME','MCPcounter','EPIC','TIMER','quanTIseq'];
    @attrs3 = ['Project','All_method','Consensus Cell']
    @attrs4 = ['Project','C1-C6 Subtype']
    csv_text = CSV.parse(csv_text, :headers => true)
    csv_text.each do |row|
        @csv_test[row.to_hash['project_name']] =row.to_hash
    end
    @projects= Project.order(:id)
    msg_path = "#{Rails.root}/public/data/warning.csv"
    msg_text = File.read(msg_path)
    @msg_test = {}

    msg_text = CSV.parse(msg_text, :headers => true)
    msg_text.each do |row|
        @msg_test[row.to_hash['project']+row.to_hash['method']] =row.to_hash
    end


  end
end
