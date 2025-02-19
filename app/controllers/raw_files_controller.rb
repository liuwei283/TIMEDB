class RawFilesController < ApplicationController
  # protect_from_forgery :only => [:update, :destroy, :create]
    protect_from_forgery except: :public_file

    def index
      path = Base64.decode64(params[:path])
      absPath = File.join Rails.root, 'data', path
      send_file absPath
    end

    def public
      path = Base64.decode64(params[:path])
      absPath = File.join '/data', path
      redirect_to absPath
    end

    def viz_file
      path = File.join Rails.root, 'data', "static_viz_data", full_path 
      send_file path
    end

    def public_file
      path = File.join Rails.root, "public", "data", full_path 
      send_file path
    end

    def viz_inf_file
      path = File.join Rails.root, "public", "data", "sample_plot", full_path 
      send_file path
    end
  

    def demo
      path = File.join Rails.root, 'data/demo', full_path
      send_file path
    end
    
    def uploads
      path = File.join Rails.root, 'data/uploads', full_path
      send_file path
    end

    def outputs
      path = File.join Rails.root, 'data/outputs', full_path
      send_file path
    end
    
    def full_path
      if (params[:format])
        "#{params[:path]}.#{params[:format]}"
      else
        params[:path]
      end
    end

  end
  