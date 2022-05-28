class Api::PublicFileController < ApplicationController

    def check_file_exists
        Rails.logger.debug "===>"
        fpath = "#{Rails.root}/#{params[:fpath]}"
        fpath2 = "#{Rails.root}/#{params[:fpath2]}"
        render json:{
            fexists:File.exists?(fpath),
            fexists2:File.exists?(fpath2),
        }
    end
    
  
    
end
  