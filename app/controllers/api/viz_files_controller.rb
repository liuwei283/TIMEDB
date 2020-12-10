class Api::VizFilesController < ApplicationController
  before_action :instantiate_models

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
                    x[dataType] = {id: 0, 
                        url: File.join(demo_folder, info['demoFileName']), 
                        is_demo: true}
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
