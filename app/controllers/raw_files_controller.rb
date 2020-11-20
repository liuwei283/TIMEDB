class RawFilesController < ApplicationController
  protect_from_forgery :only => [:update, :destroy, :create]
    def index
      result_json = {
        requestParams: ''
      }
      root_path = File.join Rails.root, 'data'
      request_body = JSON.parse request.body.read
      file_config = request_body['fileConfig']
      result_data = {}
      file_config.each do |config|
        if config['allowMultiple']
          data_list = []
          config['path'].each do |path|
            file_path = File.join root_path, config['projectRoot'], path
            data_list << RawFile.read_raw_data(file_path)
          end
          result_data[config['data']] = data_list
        else 
          file_path = File.join root_path, config['projectRoot'], config['path']
          result_data[config['data']] = RawFile.read_raw_data file_path
        end
      end
      
      result_json['data'] = result_data
      render json: result_json
      # path = File.join Rails.root, 'data', params[:name] + ".csv"
      # send_file path
    end

    def public
      path = Base64.decode64(params[:path])
      redirect_to path
    end
  end
  