class AdminController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "chelijia",
    except: [:show]
    def index
        @projects = Project.order(:name)
    end

    def modify_sample_metadata
        if params[:project_id] == -1
            redirect_to '/user/admin'
        else
            #redirect_to import_project_samples_path(:project_id=>params[:project_id], :file=>params[:file])
            @project = Project.find(params[:project_id])
            Sample.import(params[:file],params[:project_id] )
            @project.update_attribute(:num_of_samples, @project.samples.count)
            update_metadata
            redirect_to project_path(@project), notice: "Samples imported."
        end
    end

    def modify_sample_abd
        #redirect_to import_abd_table_project_samples_path(:project_id=>params[:project_id], :file=>params[:file])
        @project = Project.find(params[:project_id])
        n1 = @project.name
        up_file = params[:file]
        uploader = AbdUploader.new(n1)
        uploader.store!(up_file)
        if up_file.respond_to?(:read)
            data = up_file.read
            lines = data.split("\n")
            names = lines[0].chomp.split("\t")
            n_sample = names.length() - 1
            pj_name = names[0]
            s_names = names[1..n_sample]
            i = 1
            all_json = {}
            while i < lines.length()
                line = lines[i]
                buffer = line.split("\t")
                key = buffer[0].chomp
                all_json[key] = Array.new(n_sample, "NA")
                for j in 1..n_sample
                    v = buffer[j].chomp
                    all_json[key][j-1] = v
                end
                i += 1
            end

            keys = all_json.keys
            s_names.each_with_index do |s_name, index|
                f_path = "#{$abd_dir}#{n1}_#{s_name}.tsv"
                f = File.open(f_path, "w")
                s = "#{n1}\t#{s_name}"
                i = index
                keys.each do |k|
                    s += "\n"
                    value = all_json[k][i]
                    s += "#{k}\t#{value}"
                end
                f.write(s)
                f.close
            end

        else
            logger.error "Bad file_data: #{up_file.class.name}: #{up_file.inspect}"
        end
        redirect_to @project, notice: "ALL Abundance data uploaded."
    end

    private
        def update_metadata
            @project = Project.find(params[:project_id])
            db_samples_info_path = File.join Rails.root, 'app', 'data', 'db', params[:project_id] +'_samples_metadata.csv'
            csv_file = @project.samples.to_csv
            File.open(db_samples_info_path, 'w') do |file|
                file << csv_file
            end
        end

end
