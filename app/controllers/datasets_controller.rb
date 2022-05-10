class DatasetsController < ApplicationController
    $user_stor_dir = "#{Rails.root}/data/user"
    def show
        id = session[:user_id]
        @user = User.find(id)
        @dataset = @user.datasets.find(params[:id])
        @vis = ['id', 'sample_name', 'project_name', 'c_tumor_stage', 'c_tumor_grade', 'c_sample_histology', 'c_race', 'c_gender', 'n_age', 'pfs', 'os', 'pfs_status', 'os_status', 'c_tumor_type', 'c_tumor_subtype', 'c_source_name', 'c_treatment']
        
        @sample_attrs = Sample.column_names
        @invis = []
        @sample_attrs.each_with_index do |attr, index|
            if !@vis.include?(attr)
                @invis.push(index+1)
            end
        end
        gon.push invis: @invis

        #get all projects
        projects = {}
        samples = @dataset.samples.order(:sample_name)
        samples.each do |sample|
            sname = sample.sample_name
            pname = sample.project_name
            logger.error sname
            if projects.key?(pname)
                projects[pname].push(sname)
            else
                projects[pname] = [sname]
            end
        end
        
        #merge all attributes
        @table_headers = ['id']
        projects.each_key do |pname|
            sample_clinical_file_path = "#{Rails.root}/public/data/clinical/sample/Clinical_#{pname}.csv"
            file_info = CSV.parse(File.read(sample_clinical_file_path), headers: TRUE)
            @table_headers = @table_headers | file_info.headers
        end
        @samples_info = []
        projects.each_key do |pname|
            sample_clinical_file_path = "#{Rails.root}/public/data/clinical/sample/Clinical_#{pname}.csv"
            file_info = CSV.parse(File.read(sample_clinical_file_path), headers: TRUE)
            cur_headers = file_info.headers
            snames = projects[pname]
            file_info.each do |row|
                if snames.include? row['sample_name']
                    row_info = @table_headers.to_h { |attrb| [attrb, 'Nil'] }
                    sid = Sample.find_by(sample_name: row['sample_name']).id
                    row_info['id'] = sid
                    cur_headers.each do |cur_header|
                        row_info[cur_header] = row[cur_header]
                    end
                    @samples_info.push(row_info)
                end
            end
        end

        @samples_info.each do |samp|
            @table_headers.each do |th|
                logger.error samp[th]
            end
        end
        # user_dir = File.join($user_stor_dir, id.to_s)
        # ds_dir = File.join(user_dir, @dataset.name)
        # Dir.mkdir(ds_dir) unless File.exists?(ds_dir)
        # @file_list = Dir.entries(ds_dir)[2..-1]
        respond_to do |format|
            format.html
            format.json { render json: DatasetSampleDatatable.new(view_context, @samples_info, @table_headers) }
        end
    end

    def destroy
        id = session[:user_id]
        @user = User.find(id)
        @dataset = @user.datasets.find(params[:id])
        @dataset.destroy
        redirect_to '/'
    end

    def edit
        id = session[:user_id]
        @user = User.find(id)
        @dataset = @user.datasets.find(params[:id])
    end
    
    def update
        id = session[:user_id]
        @user = User.find(id)
        @dataset = @user.datasets.find(params[:id])
    
         
        if @dataset.update(dataset_params)
            redirect_to user_dataset_path(@dataset)
        else
            render 'edit'
        end
    end

    def download_file
        id = session[:user_id]
        @user = User.find(id)
        @dataset = @user.datasets.find(params[:id])
        user_dir = File.join($user_stor_dir, id.to_s)
        ds_dir = File.join(user_dir, @dataset.name)
        file = File.join(ds_dir, params[:file_name])
        send_file file
    end

    def new
        @user = User.find(params[:user_id])
        @dataset = @user.datasets.build
    end

    def create
        id = session[:user_id]
        @user = User.find(id)
        @dataset = @user.datasets.create(dataset_params)
        @user.update_attribute(:dataset_n, @user.datasets.count)
        if @dataset.save
            # user_dir = File.join($user_stor_dir, id.to_s)
            # ds_dir = File.join(user_dir, @dataset.name)
            # Dir.mkdir(ds_dir)
            redirect_to user_dataset_path(:id => @dataset.id)
        else
            render 'new'
        end
    end

    def upload_file
        up_file = params[:file]
        id = session[:user_id]
        @user = User.find(id)
        @dataset = @user.datasets.find(params[:id])
        user_dir = File.join($user_stor_dir, id.to_s)
        ds_dir = File.join(user_dir, @dataset.name)
        File.open(File.join(ds_dir, up_file.original_filename), 'wb') do |file|
            file.write(up_file.read)
        end
        redirect_to user_dataset_path, notice: "File uploaded."

    end

    def delete_sample
        @dataset = @user.datasets.find(params[:id])
        @dataset.delete_samples(params[:selected_ids])
        redirect_to user_dataset_path
    end

    def download_ds_inf
        @dataset = @user.datasets.find(params[:id])
        send_data @dataset.inf_file(), :filename => "#{@dataset.name}_inf.tsv"
    end

    def download_ds_metadata
        @dataset = @user.datasets.find(params[:id])
        send_data @dataset.metadata_file(), :filename => "#{@dataset.name}_metadata.csv"
    end

    private

    def dataset_params
        params.require(:dataset).permit(:name)
    end
end
