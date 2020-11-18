class RawFilesController < ApplicationController
  protect_from_forgery :only => [:update, :destroy, :create]
    # def index
    #   result_json = {
    #     requestParams: ''
    #   }
    #   root_path = File.join Rails.root, 'data'
    #   request_body = JSON.parse request.body.read
    #   file_config = request_body['fileConfig']
    #   result_data = {}
    #   file_config.each do |config|
    #     file_path = File.join root_path, config['path']
    #     if File.exist?(file_path)
    #       data_file = File.open(file_path)
    #       result_data[config['data']] = data_file.read
    #       data_file.close
    #     else 
    #       result_json['errorMessage'] = 'cannot find file: '+ file_path
    #       break
    #     end
    #   end
      
    #   result_json['data'] = result_data
    #   render json: result_json
    #   # path = File.join Rails.root, 'data', params[:name] + ".csv"
    #   # send_file path
    # end
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
  end
  