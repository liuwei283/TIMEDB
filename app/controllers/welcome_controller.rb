require 'zip'

class WelcomeController < ApplicationController
  #skip_before_action :validate_cookie, only: [:index, :contact]
  def index
    #@user = User.find(session[:user_id])
  end

  # def tutorial
  # end

  def contact
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
    logger.error "----------------------------------"
    logger.error "----------------------------------"

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
    # redirect_to root_path, alert: 'Happy to use our website!' 
  end
end
