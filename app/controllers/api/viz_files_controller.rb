class Api::VizFilesController < ApplicationController
  before_action :instantiate_models

    def use_demo
        if @analysis_user_datum.use_demo_file
            render json:{}
            return
        else
            @analysis_user_datum.use_demo_file = true
            @analysis_user_datum.save!
        end
        render json:{code:true}
    end

    def all_files
        data = []
        files_info = @analysis.files_info
        @viz_data_sources = @analysis.visualizer.viz_data_sources
        files_info.each do |dataType, info|
            vds = @viz_data_sources.find_by(data_type:dataType)
            files = vds.viz_file_objects.where analysis:@analysis, visitor:@visitor
            data << {
                id: vds.id,
                name: info['name'],
                dataType: dataType,
                optional: vds.optional,
                multiple: vds.allow_multiple,
                files: files || []
            }
        end
        render json: data
    end

    def chosen_file_paths
        
        files_info = @analysis.files_info
        if @analysis_user_datum.use_demo_file
            demo_folder = File.join '/data/demo', @analysis.name.gsub!(' ','_')
            render json: {}.tap { |x|
                files_info.each do |dataType, info|
                    Rails.logger.debug("===>#{info['demoFileName'].class}")
                    if info['demoFileName'].class == String
                        x[dataType] = {id: 0, 
                            url: File.join(demo_folder, info['demoFileName']), 
                            is_demo: true}
                    else
                        x[dataType] = info['demoFileName'].map do |fName|
                            {id: 0, 
                            url: File.join(demo_folder, fName), 
                            is_demo: true}
                        end
                    end
                end
            }
            return
        end
        
        render json: {}.tap { |x|
            @analysis.files_info.each do |dataType, info|
                if @analysis_user_datum.chosen[dataType].blank? 
                    x[dataType] = nil
                else
                    fileId = @analysis_user_datum.chosen[dataType]
                    x[dataType] = { id: fileId,
                        url: VizFileObject.find(fileId).file.url 
                    }
                end
            end
        }
    end

    def get_chosen_files
        render json: {
                use_demo: @analysis_user_datum.use_demo_file,
                chosen: @analysis_user_datum.chosen
            } 
        
    end

    def update_chosen_files
        data = []
        chosen = @analysis_user_datum.chosen
        @analysis.files_info.keys.each do |dataType|
            next unless !params["_f_#{dataType}"].blank?
            if params["_f_#{dataType}"] == 'null'
                chosen.except! dataType
            else    
                vfo = VizFileObject.find(params["_f_#{dataType}"])
                data << vfo
                chosen[dataType] = vfo.id
            end
        end
        @analysis_user_datum.chosen = chosen
        if @analysis_user_datum.use_demo_file
            @analysis_user_datum.use_demo_file = false
        end
        @analysis_user_datum.save!
        render json: { status: 'ok', files: data }
    end

    def create_files
        return head 422 unless request.xhr?
        
        result = {}
        chosen = @analysis_user_datum.chosen
        params.each do |key, file|
            next unless key.start_with? '_f_'
            dataType = key.delete_prefix('_f_')
            vfo = @visitor.viz_file_objects.new
            vfo.file = file
            vds = VizDataSource.find_by data_type:dataType
            vfo.viz_data_source = vds
            vfo.file = file
            vfo.name = params["_fn_#{dataType}"]
            vfo.analysis = @analysis
            vfo.save!
            result[dataType] = { id: vfo.id }
            chosen[dataType] = vfo.id
        end
        @analysis_user_datum.chosen = chosen
        @analysis_user_datum.save!

        render json: { status: 'ok', files: result }
    end

    def batch_delete_files
        file_ids = params[:file_ids]
        VizFileObject.find(file_ids).each do |file|
          continue unless file.analysis == @analysis
          # TODO: check file sets
          file.destroy
        end
        # check if any analysis has selected deleted files.
        # if so, set them to nil.
        # Analysis.find_each do |analysis|
        #   datum = AnalysisUserDatum.find_by project: @project, analysis: analysis
        #   next if datum.nil?
        #   changed = false
        #   new_data = datum.chosen_files.transform_values do |fid|
        #     if file_ids.include? fid
        #       changed = true
        #       next nil
        #     end
        #     fid
        #   end
        #   next unless changed
        #   datum.chosen_files = new_data
        #   datum.save
        # end
    
        # @project.update_filesize
    end
    # def demo_files
    #     data = {}
    #     if @analysis_user_datum.use_demo_file
    #         data = @analysis.demo_files
    #     end
    #     render json: data
    # end


    def instantiate_models
        @analysis = Analysis.find(params[:analysis_id])
        @visitor = Visitor.find(session[:visitorid])
        @analysis_user_datum = AnalysisUserDatum.find_by analysis:@analysis, visitor: @visitor
    end
end
