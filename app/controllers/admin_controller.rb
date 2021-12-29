class AdminController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "Lovelace"
    $inf_dir = "#{Rails.root}/app/data/inf_files/"
    def index
        @projects = Project.order(:project_name)
        @organs = Organ.order(:primary_site)
        @ana_cate = AnalysisCategory.order(:name)
        @ac_attrs = AnalysisCategory.column_names
        @viz = Visualizer.order(:name)
        @viz_attrs = Visualizer.column_names
        @ana = Analysis.order(:name)
        @a_attrs = Analysis.column_names
    end

    def modify_sample_inf
        #redirect_to import_inf_table_project_samples_path(:project_id=>params[:project_id], :file=>params[:file])
        @project = Project.find(params[:project_id])
        n1 = @project.project_name
        up_file = params[:file]
        # uploader = AbdUploader.new(n1)
        # uploader.store!(up_file)
        if up_file.respond_to?(:read)
            data = up_file.read
            lines = data.split("\n")
            names = lines[0].chomp.split("\t") 
            n_sample = lines.length() - 1 #number of sample
            n_key = names.length() - 1
            pj_name = names[0]
            keys = names[1..n_key]
            i = 1
            all_json = {}
            while i < lines.length()
                line = lines[i]
                sample_info = line.split("\t")
                s_name = sample_info[0].chomp
                f_path = "#{$inf_dir}#{n1}_#{s_name}.tsv"
                f = File.open(f_path, "w")
                s = "#{n1}\t#{s_name}"
                keys.each_with_index do |k, index|
                    value =  sample_info[index + 1]
                    if value.to_f != 0
                        s += "\n"
                        s += "#{k}\t#{value}"
                    end
                end
                f.write(s)
                f.close
            end
        else
            logger.error "Bad file_data: #{up_file.class.name}: #{up_file.inspect}"
        end
        redirect_to '/admin', notice: "ALL immune infiltration data uploaded."
    end

    def delete_samples
        up_file = params[:file]
        if up_file.respond_to?(:read)
            data = up_file.read
            lines = data.split("\n")
            lines.each do |line|
                id = line.chomp
                if Sample.exists? id
                    Sample.find(id).destroy
                end
            end

        else
            logger.error "Bad file_data: #{up_file.class.name}: #{up_file.inspect}"
        end
        redirect_to '/admin', notice: "Samples deleted."
    end

    def update_all_samples
        Sample.import(params[:file])
        redirect_to '/admin', notice: "Samples imported."
    end


    #consider delete later
    def update_all_organs
        Organ.import(params[:file])
        redirect_to '/admin', notice: "Organs imported."
    end

    def modify_viz
        Visualizer.import(params[:file])
        redirect_to '/admin', notice: "Visualization imported."
    end

    def modify_ana_cate
        AnalysisCategory.import(params[:file])
        redirect_to '/admin', notice: "Analysis category imported."
    end
    
    def modify_ana
        Analysis.import(params[:file])
        redirect_to '/admin', notice: "Analysis module imported."
    end

    def add_img
        file = params[:image_file]
        @filename = file.original_filename
        File.open("#{Rails.root}/app/assets/images/#{@filename}", "wb") do |f|
            f.write(file.read)
        end
        redirect_to '/admin', notice: "Image added."
    end

    def modify_viz_source
        VizDataSource.import(params[:file])
        redirect_to '/admin', notice: "Visualization source imported."
    end
end
