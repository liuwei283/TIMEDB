class AnalysisController < ApplicationController
    before_action :instantiate_sidebar
    def index
    end

    def show 
        # @analysis = Analysis.find(id:params[:id])
        @analysis = Analysis.find(params[:id])
        required_source_files = @analysis.viz_source_files
        required_data = []
        required_source_files.each do |vsf|
            # parsed_file = {
            #     dataType: vsf.data_type,
            #     fileName: vsf.name,
            #     fileIndex: vsf.id,
            #     optional: vsf.optional,
            #     files: vsf.viz_data_objects
            # }
            required_data << vsf.data_type
        end

        if AnalysisUserDatum.where("visitor_id = ? AND analysis_id = ?",
                session[:visitorid], params[:id]).blank?
            @analysisUserDatum = @analysis.analysis_user_data.new
            default_chosen = {} 
            required_source_files.each do |vsf|
                next unless !vsf.optional
                default_chosen[vsf.data_type] = nil
            end
            @analysisUserDatum.chosen =  default_chosen.as_json
            @analysisUserDatum.visitor = Visitor.find(session[:visitorid])
            @analysisUserDatum.save!
        end


        gon.push visualizer: @analysis.visualizer,
                 analysis_id: params[:id],
                 visualizer: @analysis.js_module_name,
                 required_data: required_data, 
                 urls: {
                     all_files: "/api/all_files/#{@analysis.id}",
                     chosen_files: "/api/chosen_files/#{@analysis.id}",
                     chosen_file_paths: "/api/chosen_file_paths/#{@analysis.id}",
                     create_file: "/api/create_files/#{@analysis.id}",
                 }

    end

    def instantiate_sidebar 
        @analysis_categories = AnalysisCategory.all
        if session[:visitorid].blank?
            visitor = Visitor.create
            session[:visitorid] = visitor.id
        end
    end
end
