class DatabaseController < ApplicationController
    $db_data_dir = File.join(Rails.root, "data", "static_viz_data")

    def overview
        @cancers = Cancer.order(:cancer_type)
        @groupedIcon = ['NA', 'Hematopoietic and reticuloendothelial systems'] #change to those cancer type with unavailable icons
        #need other group set for one organ contains multiple cancer type
        #@singleIcon = []
        @groupedCancers = []
        @singleCancers = []
        @cancers.each do |cancer|
            theCancer = cancer.cancer_type 
            if !@groupedIcon.include?(theCancer)
                @singleCancers.push(cancer)
            else 
                @groupedCancers.push(cancer)
            end
        end

        #table data to be changed
        table_json = {
            'country': 'pie_GMREPO_country.tsv',  
            'phenotype': 'pie_GMREPO_phenotype.tsv',
            'sex': 'pie_GMREPO_sex.tsv',  
            'BMI': 'pie_HMGDB_bmi_class.tsv',
            'age': 'pie_HMGDB_age_class.tsv'
        };
        @table_data = {};
        table_json.each do |key, path|
            p = File.join($db_data_dir, path)
            if(File.file?(p))
                current_json = {}
                File.readlines(p).each_with_index do |line, i|
                    line = line.gsub(/"/, '' )
                    contents = line.chomp.split("\t")
                    if i == 0
                        current_json['head'] = contents
                    elsif current_json['body']
                        current_json['body'].push(contents)
                    else  
                        current_json['body']= [contents]
                    end
                end
            end
            @table_data[key] = current_json
        end
        gon.push table_data: @table_data       
    end

    def download_bar_file
        name = params[:bar_selected]
        send_file(
            "#{Rails.root}/data/overview/" + name + "_samples.tsv",
            filename: "samples_num.tsv",
            type: "application.tsv"
        )
    end

    def refreshSelector
        logger.info "hgfg"
        cancer_id = params[:cancer_id]
        cancer = Cancer.find(cancer_id)
        projects = cancer.projects.order(:project_name)
        pjs_json = []
        projects.each do |pj|
            pj_json = {
                "name" => pj.project_name
            }
            pjs_json << pj_json
        end
        respond_to do |format|
            format.json {render json: pjs_json}
        end
    end

    def get_drop_down_projects
        val = params[:cancer_id]
        #Use val to find records
        options = Cancer.find(val).projects.collect{|x| "'' : '#{x.project_name}'"}    
        render :text => "{#{options.join(",")}}" 
      end
end
