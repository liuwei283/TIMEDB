class SamplesController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "chelijia", only: [:new, :create, :edit, :new, :update, :destroy]
    $seq_dir = "#{Rails.root}/app/data/seq/"
    $abd_dir = "#{Rails.root}/app/data/abd_files/"
    $tmp_dir = "#{Rails.root}/app/data/tmp/"
    $user_stor_dir = "#{Rails.root}/data/user"

    def index
        @samples = Sample.order(:sample_name)
        @sample_attrs = Sample.column_names
        @user = User.find(session[:user_id])
        id = session[:user_id]
        @user = User.find(id)
        user_dir = File.join($user_stor_dir, id.to_s)
        @datasets = @user.datasets
        respond_to do |format|
            format.html
            format.csv { send_data @samples.to_csv }
        end
    end

    def new
        @project = Project.find(params[:project_id])
        @sample = @project.samples.build
        @sample_attrs = Sample.column_names
    end

    def show
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
        @attrs = Sample.column_names
        abd_name = "#{@project.name}_#{@sample.sample_name}.tsv"
        abd_path = File.join("/app/data/abd_files/", abd_name)
        @abd_exist = File.exist?(abd_path)
        gon.push file: abd_path
    end

    def create
        @project = Project.find(params[:project_id])
        @sample = @project.samples.create(sample_params)
        @project.update_attribute(:num_of_samples, @project.samples.count)
        @sample.update_attribute(:project_name, @project.name)
        if @sample.save
            redirect_to project_path(@project)
        else
            render 'new'
        end
    end

    def destroy
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
        @sample.destroy
        @project.update_attribute(:num_of_samples, @project.samples.count)
        redirect_to project_path(@project)
    end

    def edit
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
        @sample_attrs = Sample.column_names
    end
    
    def update
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
         
        if @sample.update(sample_params)
            update_metadata
            redirect_to @project
        else
            render 'edit'
        end
    end

    def import
        @project = Project.find(params[:project_id])
        Sample.import(params[:file],params[:project_id] )
        @project.update_attribute(:num_of_samples, @project.samples.count)
        update_metadata
        redirect_to project_path(@project), notice: "Samples imported."
    end

    def make_project_seleted_file
        if params[:metadata]
            download_selected_metadata_file
        elsif params[:abundance]
            download_selected_abd_file
        elsif params[:seqence]
            "nothing"

        elsif params[:metadata2ds]
            export_selected_metadata_dataset

        elsif params[:abd2ds]
            export_selected_abd_dataset

        elsif params[:seqence]
            "nothing"

        end
    end

    def make_selected_file
        if params[:metadata]
            download_selected_metadata_file
        elsif params[:abundance]
            download_selected_abd_file
        elsif params[:seqence]
            "nothing"

        elsif params[:metadata2ds]
            export_selected_metadata_dataset

        elsif params[:abd2ds]
            export_selected_abd_dataset

        elsif params[:seqence]
            "nothing"

        end

    end

    def export_selected_metadata_dataset
        id = session[:user_id]
        @user = User.find(id)
        user_dir = File.join($user_stor_dir, id.to_s)
        ds_name = params[:ds_selected]  
        ds_dir = File.join(user_dir, ds_name) 
        # @project = Project.find(params[:project_id])
        if params[:project_id]
            redict = 'pj'
        else
            redict = 'sp'
        end
        @samples = Sample.order(:sample_name)
        content = @samples.selected_to_csv(params[:sample_ids])
        time = Time.now
        time_str = time.strftime("%Y_%m_%d")       
        time_str += ("_" + time.strftime("%k_%M")) 
        file_path = File.join(ds_dir, "selected_metadata_#{time_str}.csv")
        File.open(file_path, 'w') do |file|
            file << content
        end
        if redict == 'pj'
            @project = Project.find(params[:project_id])
            redirect_to @project
        else
            redirect_to samples_path
        end
            
    end

    def export_selected_abd_dataset
        id = session[:user_id]
        @user = User.find(id)
        user_dir = File.join($user_stor_dir, id.to_s)
        ds_name = params[:ds_selected]  
        ds_dir = File.join(user_dir, ds_name) 
        # @project = Project.find(params[:project_id])
        if params[:project_id]
            redict = 'pj'
        else
            redict = 'sp'
        end
        time = Time.now
        time_str = time.strftime("%Y_%m_%d")       
        time_str += ("_" + time.strftime("%k_%M")) 
        file_path = File.join(ds_dir, "selected_abd_#{time_str}.tsv")
        len = params[:sample_ids].length()
        if len<1
            redirect_to @project
        else
            out_json = {}
            params[:sample_ids].each_with_index do |id, index|
                # @sample = @project.samples.find(id)
                # n1 = @project.name
                @sample = Sample.find(id)
                @project = Project.find(@sample.project_id)
                n1 = @project.name
                n2 = @sample.sample_name
                file_current = "#{$abd_dir}#{n1}_#{n2}.tsv"
                i = index
                if (File.file?(file_current))
                    File.readlines(file_current).each_with_index do |line, index2|
                        if index2 >0
                            contents = line.split("\t")
                            k = contents[0].chomp
                            v = contents[1].chomp
                            if !(out_json.key?(k))
                                out_json[k] = Array.new(len, 0.0)
                            end
                            out_json[k][i] = v.to_f
                        end
                    end
                end
            end
            if params[:project_id]
                pj_name = @project.name
            else
                pj_name = 'selected'
            end
            keys = out_json.keys


            s1 = "#{pj_name}"
            params[:sample_ids].each_with_index do |id, index|
                # @sample = @project.samples.find(id)
                @sample = Sample.find(id)
                s_name = @sample.sample_name
                s1 += "\t#{s_name}"
            end

            keys.each do |key|
                s1 += "\n"
                s1 += "#{key}"
                i = 0
                while i<len
                    v = out_json[key][i]
                    s1 += "\t#{v}"
                    i = i+1
                end
            end
            
            File.open(file_path, 'w') do |file|
                file << s1
            end

            if redict == 'pj'
                @project = Project.find(params[:project_id])
                redirect_to @project
            else
                redirect_to samples_path
            end
        end
        
        
    end

    


    def download_selected_metadata_file
        @samples = Sample.order(:sample_name)
        send_data @samples.selected_to_csv(params[:sample_ids]), :filename => "selected_metadata.csv"
    end

    def download_selected_abd_file
        # @project = Project.find(params[:project_id])
        file = Tempfile.new('selected_abundance.tsv')
        len = params[:sample_ids].length()
        if len<1
            file.close
            send_file file.path, :filename => "selected_abd.tsv"
        else
            out_json = {}
            params[:sample_ids].each_with_index do |id, index|
                # @sample = @project.samples.find(id)
                # n1 = @project.name
                @sample = Sample.find(id)
                @project = Project.find(@sample.project_id)
                n1 = @project.name
                n2 = @sample.sample_name
                file_current = "#{$abd_dir}#{n1}_#{n2}.tsv"
                i = index
                if (File.file?(file_current))
                    File.readlines(file_current).each_with_index do |line, index2| 
                        if index2 >0
                            contents = line.split("\t")
                            k = contents[0].chomp
                            v = contents[1].chomp
                            if !(out_json.key?(k))
                                out_json[k] = Array.new(len, 0.0)
                            end
                            out_json[k][i] = v.to_f
                        end
                    end            
                end
            end
            if params[:project_id]
                pj_name = @project.name
            else
                pj_name = 'selected'
            end
            keys = out_json.keys


            s1 = "#{pj_name}"
            params[:sample_ids].each_with_index do |id, index|
                # @sample = @project.samples.find(id)
                @sample = Sample.find(id)
                s_name = @sample.sample_name
                s1 += "\t#{s_name}"
            end

            keys.each do |key|
                s1 += "\n"
                s1 += "#{key}"
                i = 0
                while i<len
                    v = out_json[key][i]
                    s1 += "\t#{v}"
                    i = i+1
                end
            end
            
            file.write(s1)
            file.close
            send_file file.path, :filename => "selected_abd.tsv"
            /file.unlink/
        end
    end

    def download_selected_seq_file
        @project = Project.find(params[:project_id])
        params[:sample_ids].each do |id|
            @sample = @project.samples.find(id)
            n1 = @project.name
            n2 = @sample.sample_name
            send_file {"#{$seq_dir}/#{n1}_#{n2}.fasta"}

        end
    end

    def upload_abd
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
        n1 = @project.name
        n2 = @sample.sample_name
        up_file = params[:abd_file]
        uploader = AbdUploader.new("#{n1}_#{n2}")
        uploader.store!(up_file)
        redirect_to project_sample_path, notice: "Abundance data uploaded."
    end

    def download_seq
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
        n1 = @project.name
        n2 = @sample.sample_name
        file_current = "#{Rails.root}/app/data/seq/#{n1}_#{n2}.fasta"
        if File.file?(file_current)
            send_file(
            file_current,
                filename: "#{n1}_#{n2}.tsv",
            )
        else
            redirect_back fallback_location: @sample, notice: "File does NOT exist."
        end
    end

    def download_abd
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
        n1 = @project.name
        n2 = @sample.sample_name
        file_current = "#{Rails.root}/app/data/abd_files/#{n1}_#{n2}.tsv"
        if File.file?(file_current)
            send_file(
            file_current,
                filename: "#{n1}_#{n2}.tsv",
            )
        else
            redirect_back fallback_location: @sample, notice: "File does NOT exist."
        end
    end

    def import_abd_table
        @project = Project.find(params[:project_id])
        n1 = @project.name
        up_file = params[:file]
        # uploader = AbdUploader.new(n1)
        # uploader.store!(up_file)
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
                    value = all_json[k][i]
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


        def sample_params
            params.require(:sample).permit(:sample_name, :host_age, :seq_file)
        end
end
